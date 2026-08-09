package br.com.joaobarbosa.srm.creditengine.integration.exchange.impl;

import br.com.joaobarbosa.srm.creditengine.exception.ExchangeRateProviderException;
import br.com.joaobarbosa.srm.creditengine.integration.exchange.ExchangeRateProvider;
import br.com.joaobarbosa.srm.creditengine.integration.exchange.dto.ExchangeRateProviderResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;

@Component
public class ExchangeRateProviderClient implements ExchangeRateProvider {

    private final RestClient restClient;

    public ExchangeRateProviderClient(RestClient restClient) {
        this.restClient = restClient;
    }

    @Override
    public BigDecimal getRate(String sourceCurrency, String targetCurrency) {

        try {
            ExchangeRateProviderResponse response = restClient.get()
                    .uri("/latest/{source}", sourceCurrency)
                    .retrieve()
                    .body(ExchangeRateProviderResponse.class);

            if (response == null
                    || response.rates() == null
                    || !"success".equalsIgnoreCase(response.result())) {

                throw new ExchangeRateProviderException("Resposta inválida do provedor de câmbio"
                );
            }

            BigDecimal rate = response.rates().get(targetCurrency);

            if (rate == null) {
                throw new ExchangeRateProviderException("Taxa não encontrada para " + sourceCurrency + "/" + targetCurrency);
            }

            return rate;

        } catch (ExchangeRateProviderException exception) {
            throw exception;

        } catch (Exception exception) {
            throw new ExchangeRateProviderException(
                    "Não foi possível consultar a taxa de câmbio externa",
                    exception
            );
        }
    }
}