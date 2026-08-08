package br.com.joaobarbosa.srm.creditengine.dto.exchange.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ExchangeRateResponse(

        UUID id,
        String sourceCurrency,
        String targetCurrency,
        BigDecimal exchangeRate,
        LocalDate referenceDate

) {}