package br.com.joaobarbosa.srm.creditengine.dto.exchange.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
public record ExchangeRateRequest(

        @NotBlank(message = "A moeda de origem é obrigatória.")
        @Size(min = 3, max = 3, message = "A moeda de origem deve possuir exatamente 3 caracteres.")
        String sourceCurrency,

        @NotBlank(message = "A moeda de destino é obrigatória.")
        @Size(min = 3, max = 3, message = "A moeda de destino deve possuir exatamente 3 caracteres.")
        String targetCurrency,

        @NotNull(message = "A taxa de câmbio é obrigatória.")
        @DecimalMin(
                value = "0.000001",
                inclusive = true,
                message = "A taxa de câmbio deve ser maior que zero.")
        BigDecimal exchangeRate,

        @NotNull(message = "A data de referência é obrigatória.")
        LocalDate referenceDate
) {
}
