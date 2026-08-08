package br.com.joaobarbosa.srm.creditengine.dto.pricing.request;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record PricingSimulationRequest(

        @NotNull
        @DecimalMin(value = "0.01", message = "O valor de face deve ser maior que zero.")
        BigDecimal faceValue,

        @NotNull(message = "O tipo do recebível é obrigatório.")
        UUID receivableTypeId,

        @NotNull(message = "A data da operação é obrigatória.")
        LocalDate operationDate,

        @NotNull @FutureOrPresent(message = "A data de vencimento não pode estar no passado.")
        LocalDate dueDate,

        @NotNull(message = "A taxa base é obrigatória.")
        @DecimalMin(value = "0.0", message = "A taxa base não pode ser negativa.")
        BigDecimal baseRate,
        
        @NotNull(message = "A moeda do título é obrigatória.")
        UUID titleCurrencyId,

        @NotNull(message = "A moeda de pagamento é obrigatória.")
        UUID paymentCurrencyId

) {
}