package br.com.joaobarbosa.srm.creditengine.strategy;

import br.com.joaobarbosa.srm.creditengine.exception.InvalidInstallmentPeriodException;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

public abstract class AbstractPricingStrategy implements PricingStrategy {

    private static final int SCALE = 2;
    private static final MathContext MC = MathContext.DECIMAL128;

    @Override
    public BigDecimal calculatePresentValue(
            BigDecimal faceValue,
            BigDecimal baseRate,
            BigDecimal spread,
            long installments) {


        if (installments <= 0) {
            throw new InvalidInstallmentPeriodException(installments);
        }

        BigDecimal total = BigDecimal.ONE.add(baseRate, MC).add(spread, MC);
        BigDecimal discountFactor = total.pow((int) installments, MC);
        BigDecimal raw = faceValue.divide(discountFactor, MC);

        return raw.setScale(SCALE, RoundingMode.HALF_UP);
    }

}