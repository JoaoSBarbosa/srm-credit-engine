package br.com.joaobarbosa.srm.creditengine.dto.receivable.response;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ReceivableResponse(

        UUID id,

        UUID assignorId,

        String assignorName,

        String receivableType,

        String currency,

        BigDecimal faceValue,

        String status,

        LocalDate dueDate,

        LocalDate operationDate

) {
}