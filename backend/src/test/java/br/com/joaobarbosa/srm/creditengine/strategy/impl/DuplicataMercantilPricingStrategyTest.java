package br.com.joaobarbosa.srm.creditengine.strategy.impl;


import br.com.joaobarbosa.srm.creditengine.exception.InvalidInstallmentPeriodException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("DuplicataMercantilPricingStrategy")
public class DuplicataMercantilPricingStrategyTest {

    private static final BigDecimal SPREAD = new BigDecimal("0.015");
    private final DuplicataMercantilPricingStrategy strategy = new DuplicataMercantilPricingStrategy();


    @Test
    @DisplayName("Deve retornar o código do tipo")
    public void shouldReturnReceivableTypeCode() {
        assertEquals("DUPLICATA_MERCANTIL", strategy.getReceivableTypeCode());
    }

    @Test
    @DisplayName("Deve calcular valor presente")
    void shouldCalculatePresentValue() {

        BigDecimal result = strategy.calculatePresentValue(new BigDecimal("1000.00"), BigDecimal.ZERO, SPREAD, 1);
        assertEquals(new BigDecimal("985.22"), result);
    }

    @Test
    @DisplayName("Deve considerar taxa base")
    void shouldUseBaseRate() {

        BigDecimal result = strategy.calculatePresentValue(new BigDecimal("1000.00"), new BigDecimal("0.05"), SPREAD, 1);

        assertTrue(result.compareTo(new BigDecimal("938")) > 0);
        assertTrue(result.compareTo(new BigDecimal("939")) < 0);
    }

    @Test
    @DisplayName("Não deve aceitar parcelas iguais a zero")
    void shouldThrowWhenInstallmentsIsZero() {

        InvalidInstallmentPeriodException exception =
                assertThrows(InvalidInstallmentPeriodException.class,
                        () -> strategy.calculatePresentValue(
                                new BigDecimal("1000"),
                                BigDecimal.ZERO, SPREAD, 0)
                );

        assertEquals("O prazo em parcelas deve ser maior que zero. Valor recebido: 0", exception.getMessage());
    }
}
