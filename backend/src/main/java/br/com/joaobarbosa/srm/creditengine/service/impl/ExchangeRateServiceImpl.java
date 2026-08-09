package br.com.joaobarbosa.srm.creditengine.service.impl;

import br.com.joaobarbosa.srm.creditengine.dto.exchange.request.CreateExchangeRateRequest;
import br.com.joaobarbosa.srm.creditengine.dto.exchange.request.UpdateExchangeRateRequest;
import br.com.joaobarbosa.srm.creditengine.dto.exchange.response.ExchangeRateResponse;
import br.com.joaobarbosa.srm.creditengine.exception.DomainNotFoundException;
import br.com.joaobarbosa.srm.creditengine.exception.ExchangeRateNotFoundException;
import br.com.joaobarbosa.srm.creditengine.integration.exchange.ExchangeRateProvider;
import br.com.joaobarbosa.srm.creditengine.mappers.ExchangeRateMapper;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;
import br.com.joaobarbosa.srm.creditengine.model.entity.ExchangeRate;
import br.com.joaobarbosa.srm.creditengine.repository.CurrencyRepository;
import br.com.joaobarbosa.srm.creditengine.repository.ExchangeRateRepository;
import br.com.joaobarbosa.srm.creditengine.service.ExchangeRateService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
@Transactional
public class ExchangeRateServiceImpl implements ExchangeRateService {


    private final ExchangeRateRepository exchangeRateRepository;
    private final CurrencyRepository currencyRepository;
    private final ExchangeRateMapper mapper;
    private final ExchangeRateProvider exchangeRateProvider;

    public ExchangeRateServiceImpl(
            ExchangeRateRepository exchangeRateRepository,
            CurrencyRepository currencyRepository,
            ExchangeRateMapper mapper, ExchangeRateProvider exchangeRateProvider
    ) {
        this.exchangeRateRepository = exchangeRateRepository;
        this.currencyRepository = currencyRepository;
        this.mapper = mapper;
        this.exchangeRateProvider = exchangeRateProvider;
    }

    @Override
    @Transactional(readOnly = true)
    public ExchangeRateResponse findById(UUID id) {
        return exchangeRateRepository
                .findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new ExchangeRateNotFoundException(id));
    }

    @Override
    public Page<ExchangeRateResponse> findAll(Pageable pageable) {
        return exchangeRateRepository
                .findAll(pageable)
                .map(mapper::toResponse);
    }
    

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getLatestRate(Currency source, Currency target
    ) {

        if (source.getId().equals(target.getId())) return BigDecimal.ONE;

        return exchangeRateRepository.findFirstBySourceCurrencyIdAndTargetCurrencyIdOrderByReferenceDateDesc(source.getId(), target.getId())
                .orElseThrow(() -> new ExchangeRateNotFoundException(source.getIsoCode(), target.getIsoCode())
                ).getRate();
    }


    @Override
    public ExchangeRateResponse create(CreateExchangeRateRequest request) {

        Currency sourceCurrency = findCurrency(request.sourceCurrencyId());
        Currency targetCurrency = findCurrency(request.targetCurrencyId());

        ExchangeRate entity = mapper.toEntity(request, sourceCurrency, targetCurrency);
        ExchangeRate saved = exchangeRateRepository.save(entity);
        return mapper.toResponse(saved);
    }


    @Override
    public ExchangeRateResponse update(UUID id, UpdateExchangeRateRequest request) {


        ExchangeRate entity = exchangeRateRepository
                .findById(id)
                .orElseThrow(() -> new ExchangeRateNotFoundException(id));

        Currency sourceCurrency = findCurrency(request.sourceCurrencyId());
        Currency targetCurrency = findCurrency(request.targetCurrencyId());

        mapper.updateEntity(
                request,
                entity,
                sourceCurrency,
                targetCurrency
        );

        ExchangeRate updated = exchangeRateRepository.save(entity);
        return mapper.toResponse(updated);
    }

    @Override
    public ExchangeRateResponse sync(UUID sourceCurrencyId, UUID targetCurrencyId) {

        Currency sourceCurrency = findCurrency(sourceCurrencyId);
        Currency targetCurrency = findCurrency(targetCurrencyId);

        BigDecimal rate = exchangeRateProvider.getRate(
                sourceCurrency.getIsoCode(),
                targetCurrency.getIsoCode()
        );

        ExchangeRate exchangeRate = exchangeRateRepository
                .findFirstBySourceCurrencyIdAndTargetCurrencyIdOrderByReferenceDateDesc(
                        sourceCurrencyId,
                        targetCurrencyId
                ).orElseGet(ExchangeRate::new);

        exchangeRate.setSourceCurrency(sourceCurrency);
        exchangeRate.setTargetCurrency(targetCurrency);
        exchangeRate.setRate(rate);
        exchangeRate.setReferenceDate(LocalDate.now());

        ExchangeRate saved = exchangeRateRepository.save(exchangeRate);

        return mapper.toResponse(saved);
    }


    private Currency findCurrency(UUID id) {
        return currencyRepository.findById(id).orElseThrow(() -> new DomainNotFoundException(id));
    }
}