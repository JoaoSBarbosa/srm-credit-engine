package br.com.joaobarbosa.srm.creditengine.mappers;

import br.com.joaobarbosa.srm.creditengine.dto.receivableType.reponse.ReceivableTypeResponse;
import br.com.joaobarbosa.srm.creditengine.model.entity.ReceivableType;

public interface ReceivableTypeMapper {

    ReceivableTypeResponse toResponse(ReceivableType receivableType);
}
