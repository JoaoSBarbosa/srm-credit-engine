package br.com.joaobarbosa.srm.creditengine.dto.receivableType.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CreateReceivableType(

        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 100, message = "O nome deve possuir no máximo 100 caracteres")
        String name,

        @NotBlank(message = "O código é obrigatório")
        @Size(max = 50, message = "O código deve possuir no máximo 50 caracteres")
        String code,

        @NotNull(message = "A taxa de spread é obrigatória")
        @DecimalMin(value = "0.0", inclusive = true, message = "A taxa de spread não pode ser negativa")
        @DecimalMax(value = "99.9999", inclusive = true, message = "A taxa de spread deve ser no máximo 99.9999")
        BigDecimal spreadRate

) {
}