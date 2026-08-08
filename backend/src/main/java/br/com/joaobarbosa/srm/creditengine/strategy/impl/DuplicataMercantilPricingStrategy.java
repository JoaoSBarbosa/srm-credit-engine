package br.com.joaobarbosa.srm.creditengine.strategy.impl;

import br.com.joaobarbosa.srm.creditengine.strategy.AbstractPricingStrategy;
import org.springframework.stereotype.Component;

@Component
public class DuplicataMercantilPricingStrategy extends AbstractPricingStrategy {

    private static final String RECEIVABLE_TYPE_CODE = "DUPLICATA_MERCANTIL";

    @Override
    public String getReceivableTypeCode() {
        return RECEIVABLE_TYPE_CODE;
    }

}
