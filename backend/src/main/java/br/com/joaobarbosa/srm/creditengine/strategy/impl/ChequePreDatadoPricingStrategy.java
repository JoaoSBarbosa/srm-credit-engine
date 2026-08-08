package br.com.joaobarbosa.srm.creditengine.strategy.impl;

import br.com.joaobarbosa.srm.creditengine.strategy.AbstractPricingStrategy;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ChequePreDatadoPricingStrategy extends AbstractPricingStrategy {
    private static final String RECEIVABLE_TYPE_CODE = "CHEQUE_PRE_DATADO";


    @Override
    public BigDecimal getSpread() {
        return new BigDecimal("0.025");
    }

    @Override
    public String getReceivableTypeCode() {
        return RECEIVABLE_TYPE_CODE;
    }
}
