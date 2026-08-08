package br.com.joaobarbosa.srm.creditengine.service.impl;


import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.CreateReceivableBatchRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.CreateReceivableRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.UpdateReceivableRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.response.ReceivableBatchResponse;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.response.ReceivableResponse;
import br.com.joaobarbosa.srm.creditengine.exception.ReceivableNotFoundException;
import br.com.joaobarbosa.srm.creditengine.mappers.ReceivableMapper;
import br.com.joaobarbosa.srm.creditengine.model.entity.Assignor;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;
import br.com.joaobarbosa.srm.creditengine.model.entity.Receivable;
import br.com.joaobarbosa.srm.creditengine.model.entity.ReceivableType;
import br.com.joaobarbosa.srm.creditengine.model.enums.OperationStatus;
import br.com.joaobarbosa.srm.creditengine.repository.ReceivableRepository;
import br.com.joaobarbosa.srm.creditengine.service.AssignorService;
import br.com.joaobarbosa.srm.creditengine.service.CurrencyService;
import br.com.joaobarbosa.srm.creditengine.service.ReceivableService;
import br.com.joaobarbosa.srm.creditengine.service.ReceivableTypeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReceivableServiceImpl implements ReceivableService {


    private final ReceivableRepository receivableRepository;
    private final AssignorService assignorService;
    private final CurrencyService currencyService;
    private final ReceivableTypeService receivableTypeService;
    private final ReceivableMapper mapper;


    public ReceivableServiceImpl(
            ReceivableRepository receivableRepository,
            AssignorService assignorService,
            CurrencyService currencyService,
            ReceivableTypeService receivableTypeService,
            ReceivableMapper mapper
    ) {
        this.receivableRepository = receivableRepository;
        this.assignorService = assignorService;
        this.currencyService = currencyService;
        this.receivableTypeService = receivableTypeService;
        this.mapper = mapper;
    }


    @Override
    public ReceivableResponse create(CreateReceivableRequest request) {

        Assignor assignor = assignorService.findOrCreateByDocument(request.assignorName(), request.assignorDocument());
        Currency currency = currencyService.findById(request.currencyId());
        ReceivableType type = receivableTypeService.findById(request.receivableTypeId());
        Receivable entity = mapper.toEntity(request, assignor, type, currency);
        Receivable saved = receivableRepository.save(entity);

        return mapper.toResponse(saved);
    }

    @Override
    public ReceivableBatchResponse createBatch(CreateReceivableBatchRequest request) {

        List<ReceivableResponse> created = request.receivables().stream().map(this::create).toList();

        return new ReceivableBatchResponse(request.receivables().size(), created.size(), created);
    }


    @Override
    public ReceivableResponse update(UUID id, UpdateReceivableRequest request) {

        Receivable entity = findEntity(id);
        Assignor assignor = null;

        if (request.assignorId() != null) {
            assignor = assignorService.findEntityById(request.assignorId());
        }
        Currency currency = null;

        if (request.currencyId() != null) {
            currency = currencyService.findById(request.currencyId());
        }
        ReceivableType type = null;

        if (request.receivableTypeId() != null) {
            type = receivableTypeService.findById(request.receivableTypeId());
        }
        mapper.updateEntity(request, entity, assignor, type, currency);
        Receivable saved = receivableRepository.save(entity);
        return mapper.toResponse(saved);
    }


    @Override
    @Transactional(readOnly = true)
    public ReceivableResponse findById(UUID id) {
        Receivable entity = findEntity(id);
        return mapper.toResponse(entity);
    }

    @Override
    public List<ReceivableResponse> findPending() {
        List<Receivable> receivables =
                receivableRepository.findAllByStatus(OperationStatus.PENDING);

        return receivables.stream()
                .map(mapper::toResponse)
                .toList();
    
    }

    @Override
    public void delete(UUID id) {
        Receivable entity = findEntity(id);
        receivableRepository.delete(entity);

    }


    private Receivable findEntity(UUID id) {

        return receivableRepository.findById(id).orElseThrow(() -> new ReceivableNotFoundException(id));
    }

}