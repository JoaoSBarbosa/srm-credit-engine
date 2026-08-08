package br.com.joaobarbosa.srm.creditengine.service;

import br.com.joaobarbosa.srm.creditengine.dto.settlement.request.SettlementFilterRequest;
import br.com.joaobarbosa.srm.creditengine.dto.settlement.response.SettlementResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface SettlementService {
    SettlementResponse findById(UUID id);

    Page<SettlementResponse> findAll(
            SettlementFilterRequest filter,
            Pageable pageable
    );
}
