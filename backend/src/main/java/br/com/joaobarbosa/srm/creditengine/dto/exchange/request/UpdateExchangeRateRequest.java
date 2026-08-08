package br.com.joaobarbosa.srm.creditengine.dto.exchange.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record UpdateExchangeRateRequest(

        UUID sourceCurrencyId,

        UUID targetCurrencyId,

        @DecimalMin(
                value = "0.000001",
                message = "A taxa deve ser maior que zero"
        )
        BigDecimal exchangeRate,

        LocalDate referenceDate

) {}
