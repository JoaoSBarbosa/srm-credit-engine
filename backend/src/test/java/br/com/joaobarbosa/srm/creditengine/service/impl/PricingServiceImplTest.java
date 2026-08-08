package br.com.joaobarbosa.srm.creditengine.service.impl;

import br.com.joaobarbosa.srm.creditengine.dto.pricing.request.PricingRequest;
import br.com.joaobarbosa.srm.creditengine.dto.pricing.request.PricingSimulationRequest;
import br.com.joaobarbosa.srm.creditengine.dto.pricing.response.PricingResponse;
import br.com.joaobarbosa.srm.creditengine.dto.pricing.response.PricingSimulationResponse;
import br.com.joaobarbosa.srm.creditengine.dto.pricing.result.PricingCalculationResult;
import br.com.joaobarbosa.srm.creditengine.exception.ReceivableAlreadySettledException;
import br.com.joaobarbosa.srm.creditengine.exception.ReceivableNotFoundException;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;
import br.com.joaobarbosa.srm.creditengine.model.entity.Receivable;
import br.com.joaobarbosa.srm.creditengine.model.entity.ReceivableType;
import br.com.joaobarbosa.srm.creditengine.model.entity.Settlement;
import br.com.joaobarbosa.srm.creditengine.model.enums.OperationStatus;
import br.com.joaobarbosa.srm.creditengine.repository.ReceivableRepository;
import br.com.joaobarbosa.srm.creditengine.repository.settlement.SettlementRepository;
import br.com.joaobarbosa.srm.creditengine.service.CurrencyService;
import br.com.joaobarbosa.srm.creditengine.service.PricingCalculatorService;
import br.com.joaobarbosa.srm.creditengine.service.ReceivableTypeService;
import br.com.joaobarbosa.srm.creditengine.strategy.PricingStrategy;
import br.com.joaobarbosa.srm.creditengine.strategy.PricingStrategyResolver;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PricingServiceImpl")
class PricingServiceImplTest {

    @Mock
    private ReceivableRepository receivableRepository;
    @Mock
    private CurrencyService currencyService;
    @Mock
    private PricingCalculatorService pricingCalculatorService;
    @Mock
    private SettlementRepository settlementRepository;
    @Mock
    private ReceivableTypeService receivableTypeService;
    @Mock
    private PricingStrategyResolver pricingStrategyResolver;
    @Mock
    private PricingStrategy strategy;

    private PricingServiceImpl service;

    private PricingServiceImpl newService() {
        return new PricingServiceImpl(
                receivableRepository,
                currencyService,
                pricingCalculatorService,
                settlementRepository,
                receivableTypeService,
                pricingStrategyResolver
        );
    }

    @Test
    @DisplayName("Deve liquidar um recebível pendente, criar o Settlement e marcar o Receivable como SETTLED")
    void shouldSettleReceivable() {
        service = newService();

        UUID receivableId = UUID.randomUUID();
        UUID paymentCurrencyId = UUID.randomUUID();
        UUID settlementId = UUID.randomUUID();

        Receivable receivable = new Receivable();
        receivable.setId(receivableId);
        receivable.setStatus(OperationStatus.PENDING);
        receivable.setFaceValue(new BigDecimal("1000.00"));

        Currency paymentCurrency = new Currency();
        paymentCurrency.setId(paymentCurrencyId);

        PricingCalculationResult calcResult = new PricingCalculationResult(
                new BigDecimal("985.22"), BigDecimal.ONE, new BigDecimal("985.22"));

        when(receivableRepository.findById(receivableId)).thenReturn(Optional.of(receivable));
        when(currencyService.findById(paymentCurrencyId)).thenReturn(paymentCurrency);
        when(pricingCalculatorService.calculate(receivable, paymentCurrency)).thenReturn(calcResult);
        when(settlementRepository.save(any(Settlement.class))).thenAnswer(invocation -> {
            Settlement settlement = invocation.getArgument(0);
            settlement.setId(settlementId);
            return settlement;
        });

        PricingRequest request = new PricingRequest(paymentCurrencyId, LocalDate.now());

        PricingResponse response = service.calculate(receivableId, request);

        assertEquals(settlementId, response.settlementId());
        assertEquals(receivableId, response.receivableId());
        assertEquals(new BigDecimal("985.22"), response.presentValue());
        assertEquals(OperationStatus.SETTLED, receivable.getStatus());
        verify(settlementRepository).save(any(Settlement.class));
    }

    @Test
    @DisplayName("Não deve permitir liquidar um recebível que já foi liquidado")
    void shouldNotSettleAlreadySettledReceivable() {
        service = newService();

        UUID receivableId = UUID.randomUUID();

        Receivable receivable = new Receivable();
        receivable.setId(receivableId);
        receivable.setStatus(OperationStatus.SETTLED);

        when(receivableRepository.findById(receivableId)).thenReturn(Optional.of(receivable));

        PricingRequest request = new PricingRequest(UUID.randomUUID(), LocalDate.now());

        assertThrows(ReceivableAlreadySettledException.class, () -> service.calculate(receivableId, request));

        verifyNoInteractions(pricingCalculatorService);
        verify(settlementRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando o recebível não existe")
    void shouldThrowWhenReceivableNotFound() {
        service = newService();

        UUID receivableId = UUID.randomUUID();
        when(receivableRepository.findById(receivableId)).thenReturn(Optional.empty());

        PricingRequest request = new PricingRequest(UUID.randomUUID(), LocalDate.now());

        assertThrows(ReceivableNotFoundException.class, () -> service.calculate(receivableId, request));
        verifyNoInteractions(currencyService, pricingCalculatorService, settlementRepository);
    }

    @Test
    @DisplayName("Deve simular a precificação sem persistir nenhum dado")
    void shouldSimulatePricingWithoutPersisting() {
        service = newService();

        UUID typeId = UUID.randomUUID();
        UUID titleCurrencyId = UUID.randomUUID();
        UUID paymentCurrencyId = UUID.randomUUID();

        ReceivableType type = new ReceivableType();
        type.setId(typeId);
        type.setCode("DUPLICATA_MERCANTIL");
        type.setSpreadRate(new BigDecimal("0.015"));

        Currency titleCurrency = new Currency();
        titleCurrency.setId(titleCurrencyId);

        Currency paymentCurrency = new Currency();
        paymentCurrency.setId(paymentCurrencyId);

        PricingSimulationRequest request = new PricingSimulationRequest(
                new BigDecimal("1000.00"),
                typeId,
                LocalDate.of(2026, 9, 1),
                LocalDate.of(2026, 10, 1),
                BigDecimal.ZERO,
                titleCurrencyId,
                paymentCurrencyId
        );

        when(receivableTypeService.findById(typeId)).thenReturn(type);
        when(currencyService.findById(titleCurrencyId)).thenReturn(titleCurrency);
        when(currencyService.findById(paymentCurrencyId)).thenReturn(paymentCurrency);
        when(pricingStrategyResolver.resolve("DUPLICATA_MERCANTIL")).thenReturn(strategy);
        when(strategy.calculatePresentValue(any(), any(), any(), anyLong()))
                .thenReturn(new BigDecimal("985.22"));
        when(pricingCalculatorService.resolveExchangeRate(titleCurrency, paymentCurrency))
                .thenReturn(new BigDecimal("0.18"));

        PricingSimulationResponse response = service.simulate(request);

        assertEquals(new BigDecimal("985.22"), response.presentValue());
        assertEquals(new BigDecimal("0.18"), response.appliedExchangeRate());
        assertEquals(new BigDecimal("985.22").multiply(new BigDecimal("0.18")), response.netAmount());
        verifyNoInteractions(receivableRepository, settlementRepository);
    }

    @Test
    @DisplayName("Simulação com mesma moeda de título e pagamento não deve retornar taxa de câmbio")
    void shouldSimulateWithoutExchangeRateWhenSameCurrency() {
        service = newService();

        UUID typeId = UUID.randomUUID();
        UUID currencyId = UUID.randomUUID();

        ReceivableType type = new ReceivableType();
        type.setId(typeId);
        type.setCode("DUPLICATA_MERCANTIL");
        type.setSpreadRate(new BigDecimal("0.015"));

        Currency currency = new Currency();
        currency.setId(currencyId);

        PricingSimulationRequest request = new PricingSimulationRequest(
                new BigDecimal("1000.00"),
                typeId,
                LocalDate.of(2026, 9, 1),
                LocalDate.of(2026, 10, 1),
                BigDecimal.ZERO,
                currencyId,
                currencyId
        );

        when(receivableTypeService.findById(typeId)).thenReturn(type);
        when(currencyService.findById(currencyId)).thenReturn(currency);
        when(pricingStrategyResolver.resolve("DUPLICATA_MERCANTIL")).thenReturn(strategy);
        when(strategy.calculatePresentValue(any(), any(), any(), anyLong()))
                .thenReturn(new BigDecimal("985.22"));

        PricingSimulationResponse response = service.simulate(request);

        assertNull(response.appliedExchangeRate());
        assertEquals(new BigDecimal("985.22"), response.netAmount());
        verifyNoInteractions(pricingCalculatorService);
    }
}