package br.com.joaobarbosa.srm.creditengine.mappers;

import br.com.joaobarbosa.srm.creditengine.dto.assignor.response.AssignorResponse;
import br.com.joaobarbosa.srm.creditengine.model.entity.Assignor;

public interface AssignorMapper {
    AssignorResponse toResponse(Assignor assignor);
}
