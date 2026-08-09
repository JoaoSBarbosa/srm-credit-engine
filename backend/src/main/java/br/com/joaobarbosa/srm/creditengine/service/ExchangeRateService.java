package br.com.joaobarbosa.srm.creditengine.service;

import br.com.joaobarbosa.srm.creditengine.dto.exchange.request.CreateExchangeRateRequest;
import br.com.joaobarbosa.srm.creditengine.dto.exchange.request.UpdateExchangeRateRequest;
import br.com.joaobarbosa.srm.creditengine.dto.exchange.response.ExchangeRateResponse;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;
import org.springframework.data.domain.Page;


import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.UUID;

public interface ExchangeRateService {

    ExchangeRateResponse findById(UUID id);

    Page<ExchangeRateResponse> findAll(Pageable pageable);

    BigDecimal getLatestRate(Currency source, Currency target);

    ExchangeRateResponse create(CreateExchangeRateRequest request);

    ExchangeRateResponse update(UUID id, UpdateExchangeRateRequest request);

    ExchangeRateResponse sync(UUID sourceCurrencyId, UUID targetCurrencyId);
}
