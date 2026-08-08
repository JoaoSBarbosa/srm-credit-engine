package br.com.joaobarbosa.srm.creditengine.mappers;

import br.com.joaobarbosa.srm.creditengine.dto.settlement.response.SettlementResponse;
import br.com.joaobarbosa.srm.creditengine.model.entity.Settlement;

public interface SettlementMapper {

    SettlementResponse toResponse(Settlement settlement);
}
