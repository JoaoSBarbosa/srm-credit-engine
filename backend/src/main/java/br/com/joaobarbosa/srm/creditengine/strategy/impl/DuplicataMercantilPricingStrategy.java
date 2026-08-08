package br.com.joaobarbosa.srm.creditengine.strategy.impl;

import br.com.joaobarbosa.srm.creditengine.strategy.AbstractPricingStrategy;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DuplicataMercantilPricingStrategy extends AbstractPricingStrategy {

    private static final String RECEIVABLE_TYPE_CODE = "DUPLICATA_MERCANTIL";
    private static final BigDecimal SPREAD = new BigDecimal("0.015");

    @Override
    protected BigDecimal getSpread() {
        return new BigDecimal("0.015");
    }

    @Override
    public String getReceivableTypeCode() {
        return RECEIVABLE_TYPE_CODE;
    }

}
