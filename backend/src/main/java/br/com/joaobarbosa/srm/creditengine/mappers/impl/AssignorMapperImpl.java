package br.com.joaobarbosa.srm.creditengine.mappers.impl;

import br.com.joaobarbosa.srm.creditengine.dto.assignor.response.AssignorResponse;
import br.com.joaobarbosa.srm.creditengine.mappers.AssignorMapper;
import br.com.joaobarbosa.srm.creditengine.model.entity.Assignor;
import org.springframework.stereotype.Component;

@Component
public class AssignorMapperImpl implements AssignorMapper {

    public AssignorResponse toResponse(Assignor assignor) {

        if (assignor == null) return null;
        return new AssignorResponse(
                assignor.getId(),
                assignor.getName(),
                assignor.getDocument()
        );
    }
}