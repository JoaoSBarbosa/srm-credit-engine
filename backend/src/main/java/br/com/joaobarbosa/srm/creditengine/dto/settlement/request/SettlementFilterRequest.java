package br.com.joaobarbosa.srm.creditengine.dto.settlement.request;

import java.time.LocalDate;
import java.util.UUID;

public record SettlementFilterRequest(
        LocalDate startDate,
        LocalDate endDate,
        UUID assignorId,
        UUID currencyId) {
}
