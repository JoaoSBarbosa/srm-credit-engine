package br.com.joaobarbosa.srm.creditengine.dto.receivable.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record UpdateReceivableRequest(

        @NotNull(message = "O cedente é obrigatório.")
        UUID assignorId,

        @NotNull(message = "O tipo de recebível é obrigatório.")
        UUID receivableTypeId,

        @NotNull(message = "A moeda é obrigatória.")
        UUID currencyId,

        @NotNull(message = "O valor nominal é obrigatório.")
        @DecimalMin(
                value = "0.01",
                message = "O valor deve ser maior que zero."
        )
        BigDecimal faceValue,


        @NotNull(message = "A data de vencimento é obrigatória.")
        LocalDate dueDate,
        BigDecimal baseRate
) {
}