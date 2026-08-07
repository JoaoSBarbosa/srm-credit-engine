package br.com.joaobarbosa.srm.creditengine.dto.receivableType.reponse;

import java.math.BigDecimal;
import java.util.UUID;

public record ReceivableTypeResponse(
        UUID id,
        String name,
        String code,
        BigDecimal spreadRate
) {
}