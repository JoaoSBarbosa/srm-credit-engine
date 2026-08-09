package br.com.joaobarbosa.srm.creditengine.mappers;

import br.com.joaobarbosa.srm.creditengine.dto.receivableType.reponse.ReceivableTypeResponse;
import br.com.joaobarbosa.srm.creditengine.dto.receivableType.request.CreateReceivableType;
import br.com.joaobarbosa.srm.creditengine.dto.receivableType.request.UpdateReceivableType;
import br.com.joaobarbosa.srm.creditengine.model.entity.ReceivableType;

public interface ReceivableTypeMapper {

    ReceivableTypeResponse toResponse(ReceivableType receivableType);

    ReceivableType toEntity(CreateReceivableType request);

    void updateEntity(
            UpdateReceivableType request,
            ReceivableType receivableType
    );
}
