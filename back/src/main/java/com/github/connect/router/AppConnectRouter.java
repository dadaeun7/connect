package com.github.connect.router;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.github.connect.constants.ApiConstants;
import com.github.connect.service.abstr.AppConnectIntegration;

@Configuration
public class AppConnectRouter {
    
    private final Map<String, AppConnectIntegration> integrationServiceMap;

    public AppConnectRouter(List<AppConnectIntegration> integrationServices){
        this.integrationServiceMap = integrationServices.stream()
                                    .collect(Collectors.toMap(AppConnectIntegration::getProviderName, Function.identity()));
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

        RouterFunction<ServerResponse> callbackRoute = RouterFunctions.route(
            RequestPredicates.GET(ApiConstants.APP_CONNECT+"/{provider}"),
            req -> {
                String provider = req.pathVariable("provider").toLowerCase();
                AppConnectIntegration service = integrationServiceMap.get(provider);

                String code = req.queryParam("code").orElseThrow(()-> new IllegalArgumentException("code가 누락 되었습니다."));
                String state = req.queryParam("state").orElseThrow(()-> new IllegalArgumentException("redis key가 유실 되었습니다."));

                return service.getToken(state, code)
                .flatMap(tokenDto -> service.saveAppConnectInfo(tokenDto, state))
                .flatMap(saveEntity -> ServerResponse.temporaryRedirect(URI.create(ApiConstants.FRONT+"/project/workline")).build());
            });

        return prepareRoute.and(callbackRoute);
    }

}
