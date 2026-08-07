package br.com.joaobarbosa.srm.creditengine.dto.pricing.request;


import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PricingSimulationRequest(
        @NotNull(message = "A moeda de pagamento é obrigatória")
        UUID paymentCurrencyId

) {
}