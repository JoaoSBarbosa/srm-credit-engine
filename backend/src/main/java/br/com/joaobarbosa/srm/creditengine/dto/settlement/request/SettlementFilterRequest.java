package br.com.joaobarbosa.srm.creditengine.dto.settlement.request;

import java.time.LocalDate;

public record SettlementFilterRequest(
        String assignorName,
        String currencyIso,
        String receivableTypeCode,
        String status,
        LocalDate startDate,
        LocalDate endDate

) {
}
