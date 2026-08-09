package br.com.joaobarbosa.srm.creditengine.mappers.impl;

import br.com.joaobarbosa.srm.creditengine.dto.currency.request.CreateCurrency;
import br.com.joaobarbosa.srm.creditengine.dto.currency.request.UpdateCurrency;
import br.com.joaobarbosa.srm.creditengine.dto.currency.response.CurrencyResponse;
import br.com.joaobarbosa.srm.creditengine.mappers.CurrencyMapper;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;
import org.springframework.stereotype.Component;

@Component
public class CurrencyMapperImpl implements CurrencyMapper {

    @Override
    public CurrencyResponse toResponse(Currency currency) {
        if (currency == null) return null;
        return new CurrencyResponse(
                currency.getId(),
                currency.getIsoCode(),
                currency.getName()
        );
    }

    @Override
    public Currency toEntity(CreateCurrency createCurrency) {
        if (createCurrency == null) return null;

        Currency currency = new Currency();
        currency.setIsoCode(createCurrency.isoCode());
        currency.setName(createCurrency.name());
        return currency;
    }

    @Override
    public Currency updateEntity(UpdateCurrency updateCurrency, Currency entity) {
        if (updateCurrency == null) return null;

        if (updateCurrency.isoCode() != null)
            entity.setIsoCode(updateCurrency.isoCode());


        if (updateCurrency.name() != null) entity.setName(updateCurrency.name());
        return entity;
    }
}
