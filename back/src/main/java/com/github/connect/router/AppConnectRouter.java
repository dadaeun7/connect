package com.github.connect.router;

import java.net.URI;
import org.springframework.http.HttpHeaders;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.github.connect.constants.ApiConstants;
import com.github.connect.constants.EntityFieldStandardType;
import com.github.connect.repository.AppConnectRepository;
import com.github.connect.repository.UserCacheManager;
import com.github.connect.service.abstr.AppConnectIntegration;
import com.github.connect.util.AesUtil;

import reactor.core.publisher.Mono;
import tools.jackson.databind.ObjectMapper;

@Configuration
public class AppConnectRouter {
    
    private final Map<String, AppConnectIntegration> integrationServiceMap;
    private final AppConnectRepository appConnectRepository;
    private final UserCacheManager userCacheManager;
    private final ObjectMapper objectMapper;
    private final AesUtil aesUtil;

    public AppConnectRouter(List<AppConnectIntegration> integrationServices, 
        AppConnectRepository appConnectRepository,
        UserCacheManager userCacheManager,
        ObjectMapper objectMapper,
        AesUtil aesUtil
    ){
        this.integrationServiceMap = integrationServices.stream()
                                    .collect(Collectors.toMap(AppConnectIntegration::getProviderName, Function.identity()));

        this.appConnectRepository = appConnectRepository;
        this.userCacheManager = userCacheManager;
        this.objectMapper = objectMapper;
        this.aesUtil = aesUtil;
    }

    @Bean
    public RouterFunction<ServerResponse> appConnectRoutes(){

        RouterFunction<ServerResponse> prepareRoute = RouterFunctions.route(
            RequestPredicates.POST(ApiConstants.APP_PREPARE+"/{provider}"),
            req -> {
                String provider = req.pathVariable("provider").toLowerCase();
                AppConnectIntegration service = integrationServiceMap.get(provider);

                return service.prepareIntegration(req)
                        .flatMap(state -> ServerResponse.ok().bodyValue(Map.of("state", state)));
            });


        RouterFunction<ServerResponse> rePrepareRoute = RouterFunctions.route(
            RequestPredicates.GET(ApiConstants.NOTION_REPREPARE),
            req ->{
                AppConnectIntegration service = integrationServiceMap.get(EntityFieldStandardType.APP_NOTION.toLowerCase());

                return ReactiveSecurityContextHolder.getContext()
                    .map(securityContext -> {
                        JwtAuthenticationToken token = (JwtAuthenticationToken) securityContext.getAuthentication();
                        return token.getToken().getClaimAsString("email");
                    })
                    .switchIfEmpty(Mono.error(new IllegalStateException("인증 정보(JWT 토큰)를 찾을 수 없습니다.")))
                    .flatMap(userEmail -> userCacheManager.findCacheUserId(userEmail))
                    .switchIfEmpty(Mono.error(new IllegalStateException("존재하지 않는 유저입니다.")))
                    .flatMap(userId -> appConnectRepository.getNotionInfo(userId))
                    .switchIfEmpty(Mono.error(new IllegalStateException("기존 연동 정보가 없습니다.")))
                    .flatMap(dto -> {

                        Map<String, Object> bodyMap = Map.of(
                            "clientId", dto.clientId(),
                            "clientSecret", aesUtil.decrypt(dto.clientSecret())
                        );

                        String jsonBody = objectMapper.writeValueAsString(bodyMap);

                        ServerRequest newReq = 
                            ServerRequest.from(req).header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                            .body(jsonBody).build();
                        
                        return service.prepareIntegration(newReq)
                        .flatMap(stateUuid -> {
                            String notionAuthUrl = String.format(
                                "https://api.notion.com/v1/oauth/authorize?client_id=%s&response_type=code&owner=user&redirect_uri=%s&state=%s",
                                dto.clientId(),
                                ApiConstants.BACK + ApiConstants.APP_CONNECT+"/"+EntityFieldStandardType.APP_NOTION.toLowerCase(),
                                stateUuid
                            );
                            Map<String, String> responseMap = Map.of("notionReConnectUrl", notionAuthUrl);

                            return ServerResponse.ok()
                                .contentType(MediaType.APPLICATION_JSON)
                                .bodyValue(responseMap);
                        });
            });
        }
        );

        RouterFunction<ServerResponse> callbackRoute = RouterFunctions.route(
            RequestPredicates.GET(ApiConstants.APP_CONNECT+"/{provider}"),
            req -> {
                String provider = req.pathVariable("provider").toLowerCase();
                AppConnectIntegration service = integrationServiceMap.get(provider);

                String code = req.queryParam("code").orElseThrow(()-> new IllegalArgumentException("code가 누락 되었습니다."));
                String state = req.queryParam("state").orElseThrow(()-> new IllegalArgumentException("redis key가 유실 되었습니다."));

                return service.getToken(state, code)
                .flatMap(tokenDto -> service.saveAppConnectInfo(tokenDto, state)
                    .flatMap(saveEntity -> ServerResponse.temporaryRedirect(URI.create(ApiConstants.FRONT+"/project")).build()));
            });

        return prepareRoute.and(rePrepareRoute).and(callbackRoute);
    }

}
