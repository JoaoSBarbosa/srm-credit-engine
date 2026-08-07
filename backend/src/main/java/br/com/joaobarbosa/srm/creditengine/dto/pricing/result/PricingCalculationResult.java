package br.com.joaobarbosa.srm.creditengine.dto.pricing.result;

import java.math.BigDecimal;

public record PricingCalculationResult(
        BigDecimal presentValue,
        BigDecimal exchangeRate,
        BigDecimal netAmount
) {
}