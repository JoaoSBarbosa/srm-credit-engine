package br.com.joaobarbosa.srm.creditengine.service;

import br.com.joaobarbosa.srm.creditengine.dto.receivableType.reponse.ReceivableTypeResponse;
import br.com.joaobarbosa.srm.creditengine.model.entity.ReceivableType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ReceivableTypeService {
    ReceivableType findById(UUID id);

    Page<ReceivableTypeResponse> findAll(Pageable pageable);
}
