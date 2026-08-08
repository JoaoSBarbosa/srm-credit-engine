package br.com.joaobarbosa.srm.creditengine.controller;

import br.com.joaobarbosa.srm.creditengine.dto.exchange.request.CreateExchangeRateRequest;
import br.com.joaobarbosa.srm.creditengine.dto.exchange.request.UpdateExchangeRateRequest;
import br.com.joaobarbosa.srm.creditengine.dto.exchange.response.ExchangeRateResponse;
import br.com.joaobarbosa.srm.creditengine.service.ExchangeRateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/exchange-rates")
public class ExchangeRateController {

    private final ExchangeRateService exchangeRateService;

    public ExchangeRateController(ExchangeRateService exchangeRateService) {
        this.exchangeRateService = exchangeRateService;
    }

    @PostMapping
    public ResponseEntity<ExchangeRateResponse> create(@Valid @RequestBody CreateExchangeRateRequest createExchangeRateRequest) {
        ExchangeRateResponse exchangeRateResponse = exchangeRateService.create(createExchangeRateRequest);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(exchangeRateResponse.id()).toUri();

        return ResponseEntity.created(location).body(exchangeRateResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExchangeRateResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateExchangeRateRequest updateExchangeRateRequest) {
        ExchangeRateResponse exchangeRateResponse = exchangeRateService.update(id, updateExchangeRateRequest);
        return ResponseEntity.ok(exchangeRateResponse);
    }

    @PostMapping("/sync")
    public ResponseEntity<ExchangeRateResponse> syncFromMockedProvider(
            @RequestParam UUID sourceCurrencyId,
            @RequestParam UUID targetCurrencyId
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(exchangeRateService.syncFromMockedProvider(sourceCurrencyId, targetCurrencyId));
    }
}
