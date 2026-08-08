package br.com.joaobarbosa.srm.creditengine.mappers.impl;

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
}
