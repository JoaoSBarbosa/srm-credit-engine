package br.com.joaobarbosa.srm.creditengine.dto.exchange.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateExchangeRateRequest(
        @NotNull(message = "A moeda de origem é obrigatória.")
        UUID sourceCurrencyId,

        @NotNull(message = "A moeda de destino é obrigatória.")
        UUID targetCurrencyId,

        @NotNull(message = "A taxa de câmbio é obrigatória.")
        @DecimalMin(
                value = "0.000001",
                message = "A taxa de câmbio deve ser maior que zero."
        )
        BigDecimal exchangeRate,

        @NotNull(message = "A data de referência é obrigatória.")
        LocalDate referenceDate
) {
}
