package br.com.joaobarbosa.srm.creditengine.dto.receivableType.request;

import java.math.BigDecimal;

public record UpdateReceivableType(String name,
                                   String code,

                                   BigDecimal spreadRate) {
}
