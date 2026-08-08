package br.com.joaobarbosa.srm.creditengine.dto.receivable.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateReceivableRequest(

        @NotBlank(message = "O nome do cedente é obrigatório.")
        @Size(max = 200)
        String assignorName,

        @NotBlank(message = "O documento do cedente é obrigatório.")
        @Size(max = 20)
        String assignorDocument,
        
        @NotNull(message = "O tipo de recebível é obrigatório")
        UUID receivableTypeId,
        @NotNull(message = "A moeda é obrigatória")
        UUID currencyId,
        @NotNull(message = "O valor nominal é obrigatório")
        @DecimalMin(
                value = "0.01",
                message = "O valor deve ser maior que zero"
        )
        BigDecimal faceValue,
        @NotNull(message = "A data de vencimento é obrigatória")
        LocalDate dueDate,
        @NotNull(message = "A data da operação é obrigatória")
        LocalDate operationDate,
        @NotNull(message = "A taxa base é obrigatória")
        BigDecimal baseRate

) {
}