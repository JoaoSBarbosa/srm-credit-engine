package br.com.joaobarbosa.srm.creditengine.service.strategy;

public interface PricingStrategyResolver {

    PricingStrategy resolve(String receivableTypeCode);
}
