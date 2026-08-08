package br.com.joaobarbosa.srm.creditengine.service;

import br.com.joaobarbosa.srm.creditengine.dto.pricing.result.PricingCalculationResult;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;
import br.com.joaobarbosa.srm.creditengine.model.entity.Receivable;

import java.math.BigDecimal;

public interface PricingCalculatorService {
    PricingCalculationResult calculate(
            Receivable receivable,
            Currency paymentCurrency
    );

    BigDecimal resolveExchangeRate(
            Currency source,
            Currency target
    );
}
