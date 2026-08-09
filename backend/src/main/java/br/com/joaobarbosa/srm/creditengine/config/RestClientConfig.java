package br.com.joaobarbosa.srm.creditengine.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient exchangeRateRestClient() {
        return RestClient.builder()
                .baseUrl("https://open.er-api.com/v6")
                .build();
    }
}