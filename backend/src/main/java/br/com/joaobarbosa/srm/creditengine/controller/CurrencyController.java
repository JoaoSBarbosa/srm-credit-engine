package br.com.joaobarbosa.srm.creditengine.controller;

import br.com.joaobarbosa.srm.creditengine.dto.currency.request.CreateCurrency;
import br.com.joaobarbosa.srm.creditengine.dto.currency.request.UpdateCurrency;
import br.com.joaobarbosa.srm.creditengine.dto.currency.response.CurrencyResponse;
import br.com.joaobarbosa.srm.creditengine.service.CurrencyService;
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
@RequestMapping("/api/v1/currencies")
@Tag(name = "Currencies", description = "Operações de consulta de moedas")

public class CurrencyController {

    private final CurrencyService service;

    public CurrencyController(CurrencyService service) {
        this.service = service;
    }


    @GetMapping
    @Operation(summary = "Listar moedas", description = "Retorna uma página de moedas.")
    public ResponseEntity<Page<CurrencyResponse>> findAll(Pageable pageable) {
        return ResponseEntity.ok(service.findAll(pageable));
    }

    @PostMapping
    @Operation(summary = "Cadastrar moeda", description = "Cadastra uma nova moeda.")
    public ResponseEntity<CurrencyResponse> create(
            @Valid @RequestBody CreateCurrency request
    ) {
        CurrencyResponse response = service.create(request);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Atualizar moeda",
            description = "Atualiza uma moeda existente."
    )
    public ResponseEntity<CurrencyResponse> update(@PathVariable UUID id, @Valid @RequestBody UpdateCurrency request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir moeda", description = "Exclui uma moeda existente.")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}