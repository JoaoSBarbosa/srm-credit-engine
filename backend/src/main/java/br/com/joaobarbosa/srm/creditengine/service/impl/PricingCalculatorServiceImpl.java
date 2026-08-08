package br.com.joaobarbosa.srm.creditengine.service.impl;


import br.com.joaobarbosa.srm.creditengine.dto.pricing.result.PricingCalculationResult;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;
import br.com.joaobarbosa.srm.creditengine.model.entity.Receivable;
import br.com.joaobarbosa.srm.creditengine.service.ExchangeRateService;
import br.com.joaobarbosa.srm.creditengine.service.PricingCalculatorService;
import br.com.joaobarbosa.srm.creditengine.strategy.PricingStrategy;
import br.com.joaobarbosa.srm.creditengine.strategy.PricingStrategyResolver;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;

@Service
public class PricingCalculatorServiceImpl implements PricingCalculatorService {


    private final PricingStrategyResolver strategyResolver;
    private final ExchangeRateService exchangeRateService;


    public PricingCalculatorServiceImpl(
            PricingStrategyResolver strategyResolver,
            ExchangeRateService exchangeRateService
    ) {
        this.strategyResolver = strategyResolver;
        this.exchangeRateService = exchangeRateService;
    }


    @Override
    public PricingCalculationResult calculate(
            Receivable receivable,
            Currency paymentCurrency
    ) {

        long installments = calculateInstallments(receivable);

        PricingStrategy strategy = strategyResolver.resolve(receivable.getReceivableType().getCode());
        BigDecimal presentValue = strategy.calculatePresentValue(
                receivable.getFaceValue(),
                receivable.getBaseRate(),
                receivable.getReceivableType().getSpreadRate(),
                installments
        );
        BigDecimal exchangeRate = resolveExchangeRate(receivable.getCurrency(), paymentCurrency);
        BigDecimal netAmount = presentValue.multiply(exchangeRate);
        return new PricingCalculationResult(presentValue, exchangeRate, netAmount);
    }


    private long calculateInstallments(Receivable receivable
    ) {
        long months = ChronoUnit.MONTHS.between(
                receivable.getOperationDate().withDayOfMonth(1),
                receivable.getDueDate().withDayOfMonth(1)
        );
        return Math.max(months, 1);
    }

    @Override
    public BigDecimal resolveExchangeRate(
            Currency source,
            Currency target
    ) {
        if (source.getId().equals(target.getId())) {
            return BigDecimal.ONE;
        }
        return exchangeRateService.getLatestRate(source, target);
    }
}