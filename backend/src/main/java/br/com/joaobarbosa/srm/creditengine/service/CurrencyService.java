package br.com.joaobarbosa.srm.creditengine.service;

import br.com.joaobarbosa.srm.creditengine.dto.currency.request.CreateCurrency;
import br.com.joaobarbosa.srm.creditengine.dto.currency.request.UpdateCurrency;
import br.com.joaobarbosa.srm.creditengine.dto.currency.response.CurrencyResponse;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CurrencyService {

    Currency findById(UUID id);

    Page<CurrencyResponse> findAll(Pageable pageable);

    CurrencyResponse create(CreateCurrency createCurrency);

    CurrencyResponse update(UUID id, UpdateCurrency updateCurrency);

    void delete(UUID id);
}
