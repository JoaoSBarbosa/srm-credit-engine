package br.com.joaobarbosa.srm.creditengine.mappers.impl;

import br.com.joaobarbosa.srm.creditengine.dto.exchange.request.CreateExchangeRateRequest;
import br.com.joaobarbosa.srm.creditengine.dto.exchange.request.UpdateExchangeRateRequest;
import br.com.joaobarbosa.srm.creditengine.dto.exchange.response.ExchangeRateResponse;
import br.com.joaobarbosa.srm.creditengine.mappers.ExchangeRateMapper;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;
import br.com.joaobarbosa.srm.creditengine.model.entity.ExchangeRate;
import org.springframework.stereotype.Component;

@Component
public class ExchangeRateMapperImpl implements ExchangeRateMapper {


    @Override
    public ExchangeRate toEntity(
            CreateExchangeRateRequest request,
            Currency sourceCurrency,
            Currency targetCurrency
    ) {

        if (request == null) return null;
        ExchangeRate entity = new ExchangeRate();

        entity.setSourceCurrency(sourceCurrency);
        entity.setTargetCurrency(targetCurrency);
        entity.setRate(request.exchangeRate());
        entity.setReferenceDate(request.referenceDate());

        return entity;
    }


    @Override
    public void updateEntity(
            UpdateExchangeRateRequest request,
            ExchangeRate entity,
            Currency sourceCurrency,
            Currency targetCurrency
    ) {

        if (sourceCurrency != null) {
            entity.setSourceCurrency(sourceCurrency);
        }

        if (targetCurrency != null) {
            entity.setTargetCurrency(targetCurrency);
        }

        if (request.exchangeRate() != null) {
            entity.setRate(request.exchangeRate());
        }

        if (request.referenceDate() != null) {
            entity.setReferenceDate(request.referenceDate());
        }
    }


    @Override
    public ExchangeRateResponse toResponse(ExchangeRate entity) {

        return new ExchangeRateResponse(
                entity.getId(),
                entity.getSourceCurrency().getIsoCode(),
                entity.getTargetCurrency().getIsoCode(),
                entity.getRate(),
                entity.getReferenceDate()
        );
    }
}