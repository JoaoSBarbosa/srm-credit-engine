package br.com.joaobarbosa.srm.creditengine.strategy.impl;

import br.com.joaobarbosa.srm.creditengine.strategy.AbstractPricingStrategy;
import org.springframework.stereotype.Component;

@Component
public class PostDatedCheckPricingStrategy extends AbstractPricingStrategy {
    private static final String RECEIVABLE_TYPE_CODE = "CHEQUE_PRE_DATADO";


    @Override
    public String getReceivableTypeCode() {
        return RECEIVABLE_TYPE_CODE;
    }
}
