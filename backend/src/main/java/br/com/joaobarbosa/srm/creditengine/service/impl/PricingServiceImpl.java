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
import br.com.joaobarbosa.srm.creditengine.service.PricingService;
import br.com.joaobarbosa.srm.creditengine.service.ReceivableTypeService;
import br.com.joaobarbosa.srm.creditengine.strategy.PricingStrategy;
import br.com.joaobarbosa.srm.creditengine.strategy.PricingStrategyResolver;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.UUID;


@Service
@Transactional
public class PricingServiceImpl implements PricingService {


    private final ReceivableRepository receivableRepository;
    private final CurrencyService currencyService;
    private final PricingCalculatorService pricingCalculatorService;
    private final SettlementRepository settlementRepository;
    private final ReceivableTypeService receivableTypeService;
    private final PricingStrategyResolver pricingStrategyResolver;

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PricingServiceImpl.class);


    public PricingServiceImpl(
            ReceivableRepository receivableRepository,
            CurrencyService currencyService,
            PricingCalculatorService pricingCalculatorService,
            SettlementRepository settlementRepository,
            ReceivableTypeService receivableTypeService, PricingStrategyResolver pricingStrategyResolver) {
        this.receivableRepository = receivableRepository;
        this.currencyService = currencyService;
        this.pricingCalculatorService = pricingCalculatorService;
        this.settlementRepository = settlementRepository;
        this.receivableTypeService = receivableTypeService;
        this.pricingStrategyResolver = pricingStrategyResolver;
    }


    @Override
    public PricingResponse calculate(UUID receivableId, PricingRequest request) {
        Receivable receivable = findReceivable(receivableId);
        validateNotAlreadySettled(receivable);

        Currency paymentCurrency = currencyService.findById(request.paymentCurrencyId());
        PricingCalculationResult result = pricingCalculatorService.calculate(receivable, paymentCurrency);
        Settlement settlement = createSettlement(receivable, paymentCurrency, result);

        receivable.setStatus(OperationStatus.SETTLED);
        settlementRepository.save(settlement);

        return new PricingResponse(
                settlement.getId(),
                receivable.getId(),
                receivable.getFaceValue(),
                result.presentValue(),
                result.exchangeRate(),
                result.netAmount()
        );
    }


    @Override
    @Transactional(readOnly = true)
    public PricingSimulationResponse simulate(PricingSimulationRequest request) {

        ReceivableType type = receivableTypeService.findById(request.receivableTypeId());
        Currency titleCurrency = currencyService.findById(request.titleCurrencyId());
        Currency paymentCurrency = currencyService.findById(request.paymentCurrencyId());

        long installments = ChronoUnit.MONTHS.between(
                request.operationDate().withDayOfMonth(1),
                request.dueDate().withDayOfMonth(1)
        );
        installments = Math.max(installments, 1);

        PricingStrategy strategy = pricingStrategyResolver.resolve(type.getCode());

        BigDecimal presentValue = strategy.calculatePresentValue(
                request.faceValue(),
                request.baseRate(),
                type.getSpreadRate(),
                installments
        );

        boolean sameCurrency = titleCurrency.getId().equals(paymentCurrency.getId());

        BigDecimal exchangeRate = sameCurrency
                ? BigDecimal.ONE
                : pricingCalculatorService.resolveExchangeRate(titleCurrency, paymentCurrency);

        BigDecimal netAmount = presentValue.multiply(exchangeRate);

        BigDecimal totalRate = type.getSpreadRate().add(request.baseRate());

        log.debug("SIM: faceValue={}, baseRate={}, spread={}, installments={}, titleCurrency={}, paymentCurrency={}",
                request.faceValue(), request.baseRate(), type.getSpreadRate(), installments,
                titleCurrency.getIsoCode(), paymentCurrency.getIsoCode());


        return new PricingSimulationResponse(
                request.faceValue(),
                type.getSpreadRate(),
                totalRate,
                installments,
                presentValue,
                sameCurrency ? null : exchangeRate,
                netAmount
        );
    }

    private void validateNotAlreadySettled(Receivable receivable) {
        if (receivable.getStatus() != OperationStatus.PENDING) {
            throw new ReceivableAlreadySettledException(receivable.getId());
        }
    }

    private Receivable findReceivable(UUID id) {

        return receivableRepository.findById(id).orElseThrow(() -> new ReceivableNotFoundException(id));
    }


    private Settlement createSettlement(
            Receivable receivable,
            Currency paymentCurrency,
            PricingCalculationResult result
    ) {
        Settlement settlement = new Settlement();
        settlement.setReceivable(receivable);
        settlement.setPaymentCurrency(paymentCurrency);
        settlement.setPresentValue(result.presentValue());
        settlement.setAppliedExchangeRate(result.exchangeRate());
        settlement.setNetAmount(result.netAmount());
        return settlement;
    }
}