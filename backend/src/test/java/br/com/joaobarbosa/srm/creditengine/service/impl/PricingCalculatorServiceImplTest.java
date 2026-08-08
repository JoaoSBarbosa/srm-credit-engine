package br.com.joaobarbosa.srm.creditengine.service.impl;


import br.com.joaobarbosa.srm.creditengine.dto.pricing.result.PricingCalculationResult;
import br.com.joaobarbosa.srm.creditengine.exception.ExchangeRateNotFoundException;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;
import br.com.joaobarbosa.srm.creditengine.model.entity.Receivable;
import br.com.joaobarbosa.srm.creditengine.model.entity.ReceivableType;
import br.com.joaobarbosa.srm.creditengine.service.ExchangeRateService;
import br.com.joaobarbosa.srm.creditengine.strategy.PricingStrategy;
import br.com.joaobarbosa.srm.creditengine.strategy.PricingStrategyResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
@DisplayName("PricingCalculatorServiceImpl")
public class PricingCalculatorServiceImplTest {

    @Mock
    private PricingStrategyResolver strategyResolver;

    @Mock
    private ExchangeRateService exchangeRateService;
    
    @Mock
    private PricingStrategy strategy;

    private PricingCalculatorServiceImpl service;

    private Currency brl;
    private Currency usd;
    private ReceivableType type;

    @BeforeEach
    void setUp() {
        service = new PricingCalculatorServiceImpl(strategyResolver, exchangeRateService);

        brl = new Currency();
        brl.setId(UUID.randomUUID());
        brl.setIsoCode("BRL");
        brl.setName("Real");

        usd = new Currency();
        usd.setId(UUID.randomUUID());
        usd.setIsoCode("USD");
        usd.setName("Dólar");

        type = new ReceivableType();
        type.setId(UUID.randomUUID());
        type.setCode("DUPLICATA_MERCANTIL");
        type.setName("Duplicata Mercantil");
        type.setSpreadRate(new BigDecimal("0.015"));
    }

    private Receivable buildReceivable(Currency titleCurrency) {
        Receivable receivable = new Receivable();
        receivable.setId(UUID.randomUUID());
        receivable.setReceivableType(type);
        receivable.setCurrency(titleCurrency);
        receivable.setFaceValue(new BigDecimal("1000.00"));
        receivable.setBaseRate(BigDecimal.ZERO);
        receivable.setOperationDate(LocalDate.of(2026, 9, 1));
        receivable.setDueDate(LocalDate.of(2026, 10, 1));
        return receivable;
    }

    @Test
    @DisplayName("Não deve consultar câmbio quando a moeda do título é igual à de pagamento")
    void shouldNotResolveExchangeRateWhenSameCurrency() {
        Receivable receivable = buildReceivable(brl);

        when(strategyResolver.resolve("DUPLICATA_MERCANTIL")).thenReturn(strategy);
        when(strategy.calculatePresentValue(any(), any(), any(), anyLong()))
                .thenReturn(new BigDecimal("985.22"));

        PricingCalculationResult result = service.calculate(receivable, brl);

        assertEquals(new BigDecimal("985.22"), result.presentValue());
        assertEquals(BigDecimal.ONE, result.exchangeRate());
        assertEquals(new BigDecimal("985.22"), result.netAmount());
        verify(exchangeRateService, never()).getLatestRate(any(), any());
    }

    @Test
    @DisplayName("Deve aplicar a taxa de câmbio quando as moedas são diferentes (cross-currency)")
    void shouldApplyExchangeRateForCrossCurrency() {
        Receivable receivable = buildReceivable(brl);

        when(strategyResolver.resolve("DUPLICATA_MERCANTIL")).thenReturn(strategy);
        when(strategy.calculatePresentValue(any(), any(), any(), anyLong()))
                .thenReturn(new BigDecimal("985.22"));
        when(exchangeRateService.getLatestRate(brl, usd)).thenReturn(new BigDecimal("0.18"));

        PricingCalculationResult result = service.calculate(receivable, usd);

        assertEquals(new BigDecimal("0.18"), result.exchangeRate());
        assertEquals(new BigDecimal("985.22").multiply(new BigDecimal("0.18")), result.netAmount());
    }

    @Test
    @DisplayName("Deve propagar a exceção quando não existe taxa de câmbio cadastrada para o par de moedas")
    void shouldPropagateExceptionWhenExchangeRateMissing() {
        Receivable receivable = buildReceivable(brl);

        when(strategyResolver.resolve("DUPLICATA_MERCANTIL")).thenReturn(strategy);
        when(strategy.calculatePresentValue(any(), any(), any(), anyLong()))
                .thenReturn(new BigDecimal("985.22"));
        when(exchangeRateService.getLatestRate(brl, usd))
                .thenThrow(new ExchangeRateNotFoundException("BRL", "USD"));

        assertThrows(ExchangeRateNotFoundException.class, () -> service.calculate(receivable, usd));
    }

    @Test
    @DisplayName("resolveExchangeRate deve retornar 1 quando as moedas são iguais, sem chamar o serviço de câmbio")
    void resolveExchangeRateShouldReturnOneForSameCurrency() {
        BigDecimal rate = service.resolveExchangeRate(brl, brl);

        assertEquals(BigDecimal.ONE, rate);
        verify(exchangeRateService, never()).getLatestRate(any(), any());
    }

    @Test
    @DisplayName("resolveExchangeRate deve delegar ao ExchangeRateService quando as moedas são diferentes")
    void resolveExchangeRateShouldDelegateForDifferentCurrencies() {
        when(exchangeRateService.getLatestRate(brl, usd)).thenReturn(new BigDecimal("0.18"));

        BigDecimal rate = service.resolveExchangeRate(brl, usd);

        assertEquals(new BigDecimal("0.18"), rate);
    }
}
