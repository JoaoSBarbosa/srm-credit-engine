package br.com.joaobarbosa.srm.creditengine.service;

import br.com.joaobarbosa.srm.creditengine.dto.assignor.response.AssignorResponse;
import br.com.joaobarbosa.srm.creditengine.model.entity.Assignor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AssignorService {

    AssignorResponse findById(UUID id);

    Assignor findEntityById(UUID id);

    Page<AssignorResponse> findAll(Pageable pageable);

    Assignor findOrCreateByDocument(String name, String document);

}
