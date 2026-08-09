package br.com.joaobarbosa.srm.creditengine.service.impl;

import br.com.joaobarbosa.srm.creditengine.dto.assignor.response.AssignorResponse;
import br.com.joaobarbosa.srm.creditengine.exception.DomainNotFoundException;
import br.com.joaobarbosa.srm.creditengine.exception.InvalidDocumentException;
import br.com.joaobarbosa.srm.creditengine.mappers.AssignorMapper;
import br.com.joaobarbosa.srm.creditengine.model.entity.Assignor;
import br.com.joaobarbosa.srm.creditengine.repository.AssignorRepository;
import br.com.joaobarbosa.srm.creditengine.service.AssignorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AssignorServiceImpl implements AssignorService {

    private final AssignorRepository repository;
    private final AssignorMapper mapper;

    public AssignorServiceImpl(
            AssignorRepository repository,
            AssignorMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public AssignorResponse findById(UUID id) {
        return mapper.toResponse(repository.findById(id).orElseThrow(() -> new DomainNotFoundException(id)));
    }

    @Override
    @Transactional(readOnly = true)
    public Assignor findEntityById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new DomainNotFoundException(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AssignorResponse> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponse);
    }

    @Override
    public Assignor findOrCreateByDocument(String name, String document) {
        return repository.findByDocument(document)
                .map(assignor -> validateExistingAssignor(assignor, name, document))
                .orElseGet(() -> createAssignor(name, document));
    }

    private Assignor validateExistingAssignor(Assignor assignor, String name, String document) {

        if (!assignor.getName().equalsIgnoreCase(name)) {
            throw new InvalidDocumentException("Documento " + document + " já cadastrado com razão social diferente: " + assignor.getName());
        }
        return assignor;
    }

    private Assignor createAssignor(String name, String document) {
        Assignor assignor = new Assignor();
        assignor.setName(name);
        assignor.setDocument(document);

        return repository.save(assignor);
    }

}


