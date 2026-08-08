package br.com.joaobarbosa.srm.creditengine.mappers;

import br.com.joaobarbosa.srm.creditengine.dto.currency.response.CurrencyResponse;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;

public interface CurrencyMapper {

    CurrencyResponse toResponse(Currency currency);
}
