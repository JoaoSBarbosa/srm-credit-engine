package br.com.joaobarbosa.srm.creditengine.service.strategy.resolver;

import br.com.joaobarbosa.srm.creditengine.service.strategy.PricingStrategy;

public interface PricingStrategyResolver {

    PricingStrategy resolve(String receivableTypeCode);
}
