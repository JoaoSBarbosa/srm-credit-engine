package br.com.joaobarbosa.srm.creditengine.service.strategy.resolver.impl;

import br.com.joaobarbosa.srm.creditengine.exception.UnsupportedReceivableTypeException;
import br.com.joaobarbosa.srm.creditengine.service.strategy.PricingStrategy;
import br.com.joaobarbosa.srm.creditengine.service.strategy.resolver.PricingStrategyResolver;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;


@Component
public class PricingStrategyResolverImpl implements PricingStrategyResolver {

    private final Map<String, PricingStrategy> strategies;

    public PricingStrategyResolverImpl(List<PricingStrategy> strategyList) {

        this.strategies = strategyList.stream().collect(Collectors.toMap(PricingStrategy::getReceivableTypeCode, Function.identity()));

    }
    @Override
    public PricingStrategy resolve(String receivableTypeCode) {
        PricingStrategy strategy = strategies.get(receivableTypeCode);
        if (strategy == null) {
            throw new UnsupportedReceivableTypeException(receivableTypeCode);
        }
        return strategy;
    }
}
