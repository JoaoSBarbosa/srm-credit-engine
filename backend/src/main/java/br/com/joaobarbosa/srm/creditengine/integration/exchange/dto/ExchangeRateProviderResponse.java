package br.com.joaobarbosa.srm.creditengine.integration.exchange.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.Map;

public record ExchangeRateProviderResponse(
        String result,

        @JsonProperty("base_code")
        String baseCode,

        Map<String, BigDecimal> rates
) {
}