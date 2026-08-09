package br.com.joaobarbosa.srm.creditengine.service;

import br.com.joaobarbosa.srm.creditengine.dto.receivableType.reponse.ReceivableTypeResponse;
import br.com.joaobarbosa.srm.creditengine.dto.receivableType.request.CreateReceivableType;
import br.com.joaobarbosa.srm.creditengine.dto.receivableType.request.UpdateReceivableType;
import br.com.joaobarbosa.srm.creditengine.model.entity.ReceivableType;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ReceivableTypeService {
    ReceivableType findById(UUID id);

    Page<ReceivableTypeResponse> findAll(Pageable pageable);

    ReceivableTypeResponse create(@Valid CreateReceivableType request);

    void delete(UUID id);

    ReceivableTypeResponse update(UUID id, @Valid UpdateReceivableType request);
}
