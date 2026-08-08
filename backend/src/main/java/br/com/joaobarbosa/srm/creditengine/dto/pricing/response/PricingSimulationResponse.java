package br.com.joaobarbosa.srm.creditengine.dto.pricing.response;

import java.math.BigDecimal;

public record PricingSimulationResponse(

        BigDecimal faceValue,
        BigDecimal spreadRate,
        BigDecimal totalRate,
        long installments,
        BigDecimal presentValue,
        BigDecimal appliedExchangeRate,
        BigDecimal netAmount

) {
}