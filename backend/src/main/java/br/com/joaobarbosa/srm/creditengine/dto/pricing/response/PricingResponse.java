package br.com.joaobarbosa.srm.creditengine.dto.pricing.response;


import java.math.BigDecimal;
import java.util.UUID;


public record PricingResponse(

        UUID settlementId,
        UUID receivableId,
        BigDecimal faceValue,
        BigDecimal presentValue,
        BigDecimal exchangeRate,
        BigDecimal netAmount

) {

}