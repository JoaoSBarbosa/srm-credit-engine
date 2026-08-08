package br.com.joaobarbosa.srm.creditengine.service.impl;

import br.com.joaobarbosa.srm.creditengine.dto.receivableType.reponse.ReceivableTypeResponse;
import br.com.joaobarbosa.srm.creditengine.exception.DomainNotFoundException;
import br.com.joaobarbosa.srm.creditengine.mappers.ReceivableTypeMapper;
import br.com.joaobarbosa.srm.creditengine.model.entity.ReceivableType;
import br.com.joaobarbosa.srm.creditengine.repository.ReceivableTypeRepository;
import br.com.joaobarbosa.srm.creditengine.service.ReceivableTypeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;


@Service
@Transactional(readOnly = true)
public class ReceivableTypeServiceImpl implements ReceivableTypeService {


    private final ReceivableTypeRepository repository;
    private final ReceivableTypeMapper mapper;

    public ReceivableTypeServiceImpl(
            ReceivableTypeRepository repository,
            ReceivableTypeMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }


    @Override
    public ReceivableType findById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new DomainNotFoundException(id));
    }

    @Override
    public Page<ReceivableTypeResponse> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponse);

    }

}