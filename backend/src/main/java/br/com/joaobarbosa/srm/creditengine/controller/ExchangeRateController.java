package br.com.joaobarbosa.srm.creditengine.controller;

import br.com.joaobarbosa.srm.creditengine.dto.exchange.request.CreateExchangeRateRequest;
import br.com.joaobarbosa.srm.creditengine.dto.exchange.request.UpdateExchangeRateRequest;
import br.com.joaobarbosa.srm.creditengine.dto.exchange.response.ExchangeRateResponse;
import br.com.joaobarbosa.srm.creditengine.service.ExchangeRateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/exchange-rates")
@Tag(name = "Exchange Rate", description = "Endpoints for managing exchange rates")
public class ExchangeRateController {

    private final ExchangeRateService exchangeRateService;

    public ExchangeRateController(ExchangeRateService exchangeRateService) {
        this.exchangeRateService = exchangeRateService;
    }


    @GetMapping("/{id}")
    @Operation(summary = "Get Exchange Rate", description = "Retorna uma taxa de câmbio pelo identificador."
    )
    public ResponseEntity<ExchangeRateResponse> findById(@PathVariable UUID id
    ) {
        return ResponseEntity.ok(exchangeRateService.findById(id));
    }

    @GetMapping
    @Operation(summary = "List Exchange Rates", description = "Retorna uma lista paginada de taxas de câmbio."
    )
    public ResponseEntity<Page<ExchangeRateResponse>> findAll(Pageable pageable
    ) {
        return ResponseEntity.ok(exchangeRateService.findAll(pageable));
    }


    @PostMapping
    @Operation(summary = "Create Exchange Rate", description = "Cria uma nova taxa de câmbio entre duas moedas.")
    public ResponseEntity<ExchangeRateResponse> create(@Valid @RequestBody CreateExchangeRateRequest createExchangeRateRequest) {
        ExchangeRateResponse exchangeRateResponse = exchangeRateService.create(createExchangeRateRequest);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(exchangeRateResponse.id()).toUri();

        return ResponseEntity.created(location).body(exchangeRateResponse);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Exchange Rate", description = "Atualiza uma taxa de câmbio existente.")
    public ResponseEntity<ExchangeRateResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateExchangeRateRequest updateExchangeRateRequest) {
        ExchangeRateResponse exchangeRateResponse = exchangeRateService.update(id, updateExchangeRateRequest);
        return ResponseEntity.ok(exchangeRateResponse);
    }


    @PostMapping("/sync")
    @Operation(summary = "Sync Exchange Rate", description = "Sincroniza a taxa de câmbio com um provedor mockado.")
    public ResponseEntity<ExchangeRateResponse> syncFromMockedProvider(
            @RequestParam UUID sourceCurrencyId,
            @RequestParam UUID targetCurrencyId
    ) {
        ExchangeRateResponse response = exchangeRateService.sync(sourceCurrencyId, targetCurrencyId);

        return ResponseEntity.ok(response);
    }
}
