package br.com.joaobarbosa.srm.creditengine.dto.settlement.response;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record SettlementResponse(

        UUID id,
        UUID receivableId,
        String assignorName,
        String currency,
        BigDecimal faceValue,
        BigDecimal presentValue,
        BigDecimal appliedExchangeRate,
        BigDecimal netAmount,
        LocalDateTime createdAt

) {
}