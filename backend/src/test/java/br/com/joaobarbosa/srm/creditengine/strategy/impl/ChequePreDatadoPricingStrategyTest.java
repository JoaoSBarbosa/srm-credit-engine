package br.com.joaobarbosa.srm.creditengine.strategy.impl;


import br.com.joaobarbosa.srm.creditengine.exception.InvalidInstallmentPeriodException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Cheque Pre-Datado Pricing Strategy Test")
public class ChequePreDatadoPricingStrategyTest {

    private static final BigDecimal SPREAD = new BigDecimal("0.025");
    private final PostDatedCheckPricingStrategy strategy = new PostDatedCheckPricingStrategy();


    @Test
    @DisplayName("Deve retornar o código do tipo")
    public void shouldReturnReceivableTypeCode() {
        assertEquals("CHEQUE_PRE_DATADO", strategy.getReceivableTypeCode());
    }

    @Test
    @DisplayName("Deve calcular valor presente com o spread de 2,5% a.m")
    void shouldCalculatePresentValue() {

        BigDecimal result = strategy.calculatePresentValue(new BigDecimal("1000.00"), BigDecimal.ZERO, SPREAD, 1);

        assertEquals(new BigDecimal("975.61"), result);

    }

    @Test
    @DisplayName("Deve considerar a taxa base somada ao spread")
    void shouldUseBaseRate() {

        BigDecimal result = strategy.calculatePresentValue(new BigDecimal("1000.00"), new BigDecimal("0.05"), SPREAD, 1);

        assertEquals(new BigDecimal("930.23"), result);
    }

    @Test
    @DisplayName("Deve compor corretamente múltiplas parcelas (juros compostos)")
    void shouldCompoundOverMultipleInstallments() {

        BigDecimal oneInstallment = strategy.calculatePresentValue(new BigDecimal("1000.00"), BigDecimal.ZERO, SPREAD, 1);
        BigDecimal threeInstallments = strategy.calculatePresentValue(new BigDecimal("1000.00"), BigDecimal.ZERO, SPREAD, 3);

        assertTrue(threeInstallments.compareTo(oneInstallment) < 0, "Quanto maior o prazo, menor deve ser o valor presente (mais desconto)");
    }

    @Test
    @DisplayName("Não deve aceitar parcelas iguais a zero")
    void shouldThrowWhenInstallmentsIsZero() {

        InvalidInstallmentPeriodException exception =
                assertThrows(
                        InvalidInstallmentPeriodException.class,
                        () -> strategy.calculatePresentValue(
                                new BigDecimal("1000"),
                                BigDecimal.ZERO, SPREAD, 0
                        )
                );

        assertEquals("O prazo em parcelas deve ser maior que zero. Valor recebido: 0", exception.getMessage());
    }

    @Test
    @DisplayName("Não deve aceitar parcelas negativas")
    void shouldThrowWhenInstallmentsIsNegative() {

        assertThrows(
                InvalidInstallmentPeriodException.class,
                () -> strategy.calculatePresentValue(
                        new BigDecimal("1000"),
                        BigDecimal.ZERO,
                        SPREAD,
                        -1
                )
        );
    }
}
