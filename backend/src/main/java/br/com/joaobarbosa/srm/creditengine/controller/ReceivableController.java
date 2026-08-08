package br.com.joaobarbosa.srm.creditengine.controller;

import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.CreateReceivableBatchRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.CreateReceivableRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.UpdateReceivableRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.response.ReceivableBatchResponse;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.response.ReceivableResponse;
import br.com.joaobarbosa.srm.creditengine.service.ReceivableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/receivables")
@Tag(name = "Receivables", description = "Operações de cadastro e gerenciamento de recebíveis")
public class ReceivableController {

    private final ReceivableService receivableService;

    public ReceivableController(ReceivableService receivableService) {
        this.receivableService = receivableService;
    }

    @PostMapping
    @Operation(summary = "Criar recebível", description = "Cadastra um novo recebível no Credit Engine.")
    public ResponseEntity<ReceivableResponse> create(
            @RequestBody @Valid CreateReceivableRequest request
    ) {

        ReceivableResponse response = receivableService.create(request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        return ResponseEntity
                .created(location)
                .body(response);
    }

    @PostMapping("/batch")
    @Operation(summary = "Criar lote de recebíveis", description = "Cadastra um lote de recebíveis no Credit Engine.")
    public ResponseEntity<ReceivableBatchResponse> createBatch(@RequestBody @Valid CreateReceivableBatchRequest batchRequest) {
        ReceivableBatchResponse response = receivableService.createBatch(batchRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping("/{id}")
    @Operation(summary = "Buscar recebível", description = "Retorna um recebível pelo seu identificador.")
    public ResponseEntity<ReceivableResponse> findById(@PathVariable UUID id
    ) {
        return ResponseEntity.ok(receivableService.findById(id));
    }

    @GetMapping
    @Operation(summary = "Buscar todos recebiveis", description = "Retorna todos")
    public ResponseEntity<List<ReceivableResponse>> findAll() {
        List<ReceivableResponse> response = receivableService.findPending();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar recebível", description = "Atualiza um recebível existente no Credit Engine.")
    public ResponseEntity<ReceivableResponse> update(
            @PathVariable UUID id,
            @RequestBody @Valid UpdateReceivableRequest request
    ) {

        return ResponseEntity.ok(receivableService.update(id, request));
    }
}