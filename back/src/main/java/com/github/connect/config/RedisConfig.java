package com.github.connect.config;

import com.github.connect.dto.internal.JoinCompnayUser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import tools.jackson.databind.DefaultTyping;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import tools.jackson.databind.jsontype.PolymorphicTypeValidator;

@Configuration
class RedisConfig {

    @Bean
    LettuceConnectionFactory redisConnectionFactory(){
        return new LettuceConnectionFactory();
    }

    @Bean
    StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory){
        StringRedisTemplate template = new StringRedisTemplate();
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }

    @Bean
    RedisTemplate<String, Object> template(RedisConnectionFactory redisConnectionFactory){
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);

        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());

        /* JackSon 다형성에 대해 보안을 위해 타입 검증과 직렬화 클래스 범위 한정하여 PolymorphicTypeValidator 세팅 */
        PolymorphicTypeValidator ptv = BasicPolymorphicTypeValidator.builder()
                .allowIfSubType(JoinCompnayUser.class)
                .build();

        /* https://docs.spring.io/spring-data/redis/reference/api/java/org/springframework/data/redis/serializer/GenericJacksonJsonRedisSerializer.html#builder(java.util.function.Supplier)
         * builder(Supplier<B> builderFactory) 채택
         * */
        GenericJacksonJsonRedisSerializer serializer = GenericJacksonJsonRedisSerializer
                .builder(()-> JsonMapper.builder().activateDefaultTyping(ptv, DefaultTyping.NON_FINAL)).build();

        redisTemplate.setValueSerializer(serializer);
        redisTemplate.setHashValueSerializer(serializer);

        return redisTemplate;
    }
}
