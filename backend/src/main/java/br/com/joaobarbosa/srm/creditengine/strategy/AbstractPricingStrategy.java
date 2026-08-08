package br.com.joaobarbosa.srm.creditengine.strategy;

import br.com.joaobarbosa.srm.creditengine.exception.InvalidInstallmentPeriodException;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

public abstract class AbstractPricingStrategy implements PricingStrategy {

    private static final int SCALE = 2;

    @Override
    public BigDecimal calculatePresentValue(BigDecimal faceValue, BigDecimal baseRate, long installments) {

        BigDecimal spread = getSpread();

        if (installments <= 0) {
            throw new InvalidInstallmentPeriodException(installments);
        }


        BigDecimal totalRate =
                BigDecimal.ONE
                        .add(baseRate)
                        .add(spread);


        BigDecimal discountFactor = totalRate.pow(
                (int) installments,
                MathContext.DECIMAL64);

        return faceValue.divide(
                discountFactor,
                SCALE,
                RoundingMode.HALF_UP
        );
    }

    protected abstract BigDecimal getSpread();
}