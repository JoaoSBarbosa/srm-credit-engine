package br.com.joaobarbosa.srm.creditengine.dto.pricing.request;


import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;


public record PricingRequest(

        @NotNull(message = "A moeda de pagamento é obrigatória")
        UUID paymentCurrencyId,
        @NotNull(message = "A data de liquidação é obrigatória")
        LocalDate settlementDate

) {

}