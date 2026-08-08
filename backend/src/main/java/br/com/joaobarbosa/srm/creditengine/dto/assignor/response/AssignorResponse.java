package br.com.joaobarbosa.srm.creditengine.dto.assignor.response;

import java.util.UUID;

public record AssignorResponse(

        UUID id,
        String name,
        String document
) {
}
