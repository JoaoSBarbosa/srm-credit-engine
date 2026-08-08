package br.com.joaobarbosa.srm.creditengine.strategy;

public interface PricingStrategyResolver {

    PricingStrategy resolve(String receivableTypeCode);
}
