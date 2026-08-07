package br.com.joaobarbosa.srm.creditengine.service;

import br.com.joaobarbosa.srm.creditengine.dto.currency.response.CurrencyResponse;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;

import java.util.List;
import java.util.UUID;

public interface CurrencyService {

    Currency findById(UUID id);

    List<CurrencyResponse> findAll();
}
