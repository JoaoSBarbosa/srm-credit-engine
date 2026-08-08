package br.com.joaobarbosa.srm.creditengine.repository.settlement;

import br.com.joaobarbosa.srm.creditengine.dto.settlement.request.SettlementFilterRequest;
import br.com.joaobarbosa.srm.creditengine.dto.settlement.response.SettlementResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SettlementRepositoryCustom {
    Page<SettlementResponse> findByFilter(
            SettlementFilterRequest filter,
            Pageable pageable
    );
}
