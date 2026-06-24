package com.github.connect.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.github.connect.exception.custom.JwtDecodedException;

public class JwtUtil {
    
    public static String extractEmail(String accessToken){

        try{
            if(accessToken == null || accessToken.isBlank()){
                throw new JwtDecodedException("토큰이 비어있거나 올바르지 않습니다.");
            }

            if(accessToken.startsWith("Bearer ")){
                accessToken = accessToken.substring(7);
            }

            DecodedJWT decodedJwt = JWT.decode(accessToken);
            return decodedJwt.getClaim("email").asString();
            
        }catch(Exception e){
            throw new JwtDecodedException("유효하지 않은 JWT 토큰 형식입니다.");
        }
    }

    
}
