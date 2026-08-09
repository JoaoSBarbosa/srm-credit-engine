package br.com.joaobarbosa.srm.creditengine.integration.exchange;

import java.math.BigDecimal;

public interface ExchangeRateProvider {
    BigDecimal getRate(String sourceCurrency, String targetCurrency);
}
