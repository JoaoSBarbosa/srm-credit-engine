package br.com.joaobarbosa.srm.creditengine.service.impl;

import br.com.joaobarbosa.srm.creditengine.dto.currency.request.CreateCurrency;
import br.com.joaobarbosa.srm.creditengine.dto.currency.request.UpdateCurrency;
import br.com.joaobarbosa.srm.creditengine.dto.currency.response.CurrencyResponse;
import br.com.joaobarbosa.srm.creditengine.exception.DomainNotFoundException;
import br.com.joaobarbosa.srm.creditengine.mappers.CurrencyMapper;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;
import br.com.joaobarbosa.srm.creditengine.repository.CurrencyRepository;
import br.com.joaobarbosa.srm.creditengine.service.CurrencyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class CurrencyServiceImpl implements CurrencyService {


    private final CurrencyRepository repository;
    private final CurrencyMapper mapper;

    public CurrencyServiceImpl(CurrencyRepository repository, CurrencyMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }


    @Override
    public Currency findById(UUID id) {

        return repository.findById(id).orElseThrow(() -> new DomainNotFoundException(id));
    }

    @Override
    public Page<CurrencyResponse> findAll(Pageable pageable) {

        return repository.findAll(pageable)
                .map(mapper::toResponse);
    }

    @Override
    @Transactional
    public CurrencyResponse create(CreateCurrency request) {
        Currency currency = mapper.toEntity(request);
        Currency savedCurrency = repository.save(currency);
        return mapper.toResponse(savedCurrency);
    }

    @Override
    @Transactional
    public CurrencyResponse update(UUID id, UpdateCurrency request) {

        Currency currency = findById(id);
        mapper.updateEntity(request, currency);
        Currency updatedCurrency = repository.save(currency);

        return mapper.toResponse(updatedCurrency);
    }

    @Override
    public void delete(UUID id) {
        Currency currency = findById(id);
        repository.delete(currency);
    }

}