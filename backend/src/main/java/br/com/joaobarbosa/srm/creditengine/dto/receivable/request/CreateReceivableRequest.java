package br.com.joaobarbosa.srm.creditengine.dto.receivable.request;

import io.swagger.v3.oas.annotations.media.Schema;
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
        @Schema(description = "Nome da empresa cedente do recebível.", example = "Empresa ABC Ltda")
        String assignorName,

        @NotBlank(message = "O documento do cedente é obrigatório.")
        @Size(max = 20)
        @Schema(description = "Documento de identificação da empresa cedente.", example = "12345678000190")
        String assignorDocument,

        @NotNull(message = "O tipo de recebível é obrigatório")
        @Schema(description = "Identificador do tipo de recebível.", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID receivableTypeId,

        @NotNull(message = "A moeda é obrigatória")
        @Schema(description = "Identificador da moeda em que o recebível está denominado.", example = "550e8400-e29b-41d4-a716-446655440001")
        UUID currencyId,

        @NotNull(message = "O valor nominal é obrigatório")
        @DecimalMin(value = "0.01", message = "O valor deve ser maior que zero")
        @Schema(description = "Valor nominal do recebível.", example = "100000.00", minimum = "0.01")
        BigDecimal faceValue,

        @NotNull(message = "A data de vencimento é obrigatória")
        @Schema(description = "Data de vencimento do recebível.", example = "2026-12-30")
        LocalDate dueDate,

        @NotNull(message = "A data da operação é obrigatória")
        @Schema(description = "Data em que a operação de cessão foi realizada.", example = "2023-12-30")
        LocalDate operationDate,

        @NotNull(message = "A taxa base é obrigatória")
        @Schema(description = "Taxa base mensal utilizada no cálculo de precificação.", example = "0.05", minimum = "0")
        BigDecimal baseRate

) {
}