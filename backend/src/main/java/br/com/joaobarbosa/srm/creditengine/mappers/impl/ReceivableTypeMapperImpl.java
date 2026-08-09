package br.com.joaobarbosa.srm.creditengine.mappers.impl;

import br.com.joaobarbosa.srm.creditengine.dto.receivableType.reponse.ReceivableTypeResponse;
import br.com.joaobarbosa.srm.creditengine.dto.receivableType.request.CreateReceivableType;
import br.com.joaobarbosa.srm.creditengine.dto.receivableType.request.UpdateReceivableType;
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

    @Override
    public ReceivableType toEntity(CreateReceivableType request) {

        if (request == null) {
            return null;
        }

        ReceivableType receivableType = new ReceivableType();

        receivableType.setName(request.name());
        receivableType.setCode(request.code());
        receivableType.setSpreadRate(request.spreadRate());

        return receivableType;
    }

    @Override
    public void updateEntity(
            UpdateReceivableType request,
            ReceivableType receivableType
    ) {

        if (request == null || receivableType == null) {
            return;
        }

        receivableType.setName(request.name());
        receivableType.setCode(request.code());
        receivableType.setSpreadRate(request.spreadRate());
    }
}


