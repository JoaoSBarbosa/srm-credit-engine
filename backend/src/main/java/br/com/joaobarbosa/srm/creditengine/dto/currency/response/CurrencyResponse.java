package br.com.joaobarbosa.srm.creditengine.dto.currency.response;

import java.util.UUID;

public record CurrencyResponse(
        UUID id,
        String isoCode,
        String name
) {
}