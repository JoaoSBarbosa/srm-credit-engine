package br.com.joaobarbosa.srm.creditengine.service.strategy;

import java.math.BigDecimal;

public interface PricingStrategy {
    String getReceivableTypeCode();

    BigDecimal calculatePresentValue(BigDecimal faceValue, BigDecimal baseRate, BigDecimal spread, long installments);
}

