package br.com.joaobarbosa.srm.creditengine.mappers.impl;

import br.com.joaobarbosa.srm.creditengine.dto.receivableType.reponse.ReceivableTypeResponse;
import br.com.joaobarbosa.srm.creditengine.mappers.ReceivableTypeMapper;
import br.com.joaobarbosa.srm.creditengine.model.entity.ReceivableType;
import org.springframework.stereotype.Component;

@Component
public class ReceivableTypeMapperImpl implements ReceivableTypeMapper {
    @Override
    public ReceivableTypeResponse toResponse(ReceivableType receivableType) {
        if (receivableType == null) return null;
        return new ReceivableTypeResponse(
                receivableType.getId(),
                receivableType.getName(),
                receivableType.getCode(),
                receivableType.getSpreadRate()
        );
    }
}


