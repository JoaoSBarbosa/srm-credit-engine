package br.com.joaobarbosa.srm.creditengine.mappers.impl;

import br.com.joaobarbosa.srm.creditengine.dto.settlement.response.SettlementResponse;
import br.com.joaobarbosa.srm.creditengine.mappers.SettlementMapper;
import br.com.joaobarbosa.srm.creditengine.model.entity.Settlement;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SettlementMapperImpl implements SettlementMapper {

    @Override
    public SettlementResponse toResponse(Settlement settlement) {

        if (settlement == null) return null;


        return new SettlementResponse(
                settlement.getId(),
                settlement.getReceivable().getId(),
                settlement.getReceivable().getAssignor().getName(),
                settlement.getReceivable().getReceivableType().getName(),
                settlement.getPaymentCurrency().getIsoCode(),
                settlement.getReceivable().getFaceValue(),
                settlement.getPresentValue(),
                settlement.getAppliedExchangeRate(),
                settlement.getNetAmount(),
                settlement.getStatus().name(),
                settlement.getCreatedAt()
        );
    }
}