package br.com.joaobarbosa.srm.creditengine.dto.exchange.response;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class ReceivableResponse {
    private UUID id;
    private Currency targetCurrency;
    private Currency sourceCurrency;
    private BigDecimal rate;
    private LocalDate referenceDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
