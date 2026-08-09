package br.com.joaobarbosa.srm.creditengine.mappers;

import br.com.joaobarbosa.srm.creditengine.dto.currency.request.CreateCurrency;
import br.com.joaobarbosa.srm.creditengine.dto.currency.request.UpdateCurrency;
import br.com.joaobarbosa.srm.creditengine.dto.currency.response.CurrencyResponse;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;

public interface CurrencyMapper {

    CurrencyResponse toResponse(Currency currency);

    Currency toEntity(CreateCurrency createCurrency);

    Currency updateEntity(UpdateCurrency updateCurrency, Currency entity);
}
