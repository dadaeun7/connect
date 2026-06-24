package com.github.connect.config;

import com.github.connect.dto.internal.AppConnecInfoDto;
import com.github.connect.dto.internal.AppTokenCacheDto;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import tools.jackson.databind.DefaultTyping;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import tools.jackson.databind.jsontype.PolymorphicTypeValidator;

@Configuration
class RedisConfig {

    @Bean
    public ReactiveRedisConnectionFactory reactiveRedisConnectionFactory(
        @Value("${spring.data.redis.host}") String host,
        @Value("${spring.data.redis.port}") int port
        
    ){
        return new LettuceConnectionFactory(host,port);
    }

    @Bean
    @Primary
    public ReactiveRedisTemplate<String,String> cstStringRedisTemplate(LettuceConnectionFactory redisConnectionFactory){
        RedisSerializer<String> serializer = new StringRedisSerializer();
        
        RedisSerializationContext.RedisSerializationContextBuilder<String, String> builder = RedisSerializationContext.newSerializationContext(serializer);
        RedisSerializationContext<String, String> context = builder
                .key(serializer)
                .value(serializer)
                .hashKey(serializer)
                .hashValue(serializer)
                .build();

        return new ReactiveRedisTemplate<>(redisConnectionFactory, context);

    }

    @Bean
    @Primary
    public ReactiveRedisTemplate<String, Object> objRedisTemplate(LettuceConnectionFactory redisConnectionFactory){

        /* JackSon 다형성에 대해 보안을 위해 타입 검증과 직렬화 클래스 범위 한정하여 PolymorphicTypeValidator 세팅 */
        PolymorphicTypeValidator ptv = BasicPolymorphicTypeValidator.builder()
                .allowIfSubType(AppTokenCacheDto.class)
                .allowIfSubType(AppConnecInfoDto.class)
                .build();

        /* https://docs.spring.io/spring-data/redis/reference/api/java/org/springframework/data/redis/serializer/GenericJacksonJsonRedisSerializer.html#builder(java.util.function.Supplier)
         * builder(Supplier<B> builderFactory) 채택
         * */
        GenericJacksonJsonRedisSerializer serializer = GenericJacksonJsonRedisSerializer
                .builder(()-> JsonMapper.builder().activateDefaultTyping(ptv, DefaultTyping.NON_FINAL)).build();

        RedisSerializationContext.RedisSerializationContextBuilder<String, Object> builder = RedisSerializationContext.newSerializationContext(serializer);

        RedisSerializationContext<String, Object> context = builder
                .key(new StringRedisSerializer())
                .hashKey(new StringRedisSerializer())
                .value(serializer)
                .hashValue(serializer)
                .build();

        return new ReactiveRedisTemplate<>(redisConnectionFactory, context);
    }
}
