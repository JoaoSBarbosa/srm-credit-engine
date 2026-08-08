package br.com.joaobarbosa.srm.creditengine.mappers;

import br.com.joaobarbosa.srm.creditengine.dto.exchange.request.CreateExchangeRateRequest;
import br.com.joaobarbosa.srm.creditengine.dto.exchange.request.UpdateExchangeRateRequest;
import br.com.joaobarbosa.srm.creditengine.dto.exchange.response.ExchangeRateResponse;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;
import br.com.joaobarbosa.srm.creditengine.model.entity.ExchangeRate;

public interface ExchangeRateMapper {

    ExchangeRate toEntity(
            CreateExchangeRateRequest request,
            Currency sourceCurrency,
            Currency targetCurrency
    );

    void updateEntity(
            UpdateExchangeRateRequest request,
            ExchangeRate entity,
            Currency sourceCurrency,
            Currency targetCurrency
    );

    ExchangeRateResponse toResponse(ExchangeRate entity);
}