package br.com.joaobarbosa.srm.creditengine.dto.exchange.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ReceivableRequest (

    @NotBlank(message = "Source currency is required")
    @Size(min = 3, max = 3)
    String sourceCurrency,

    @NotBlank(message = "Target currency is required")
    @Size(min = 3, max = 3)
    String targetCurrency,

    @NotNull
    @DecimalMin(value = "0.000001")
    BigDecimal rate,

    @NotNull
    LocalDate referenceDate
){

}
