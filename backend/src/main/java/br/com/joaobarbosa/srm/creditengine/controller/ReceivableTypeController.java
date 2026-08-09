package br.com.joaobarbosa.srm.creditengine.controller;

import br.com.joaobarbosa.srm.creditengine.dto.receivableType.reponse.ReceivableTypeResponse;
import br.com.joaobarbosa.srm.creditengine.dto.receivableType.request.CreateReceivableType;
import br.com.joaobarbosa.srm.creditengine.dto.receivableType.request.UpdateReceivableType;
import br.com.joaobarbosa.srm.creditengine.service.ReceivableTypeService;
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
@RequestMapping("/api/v1/receivable-types")
@Tag(name = "Receivable Type", description = "Endpoints para gerenciar tipos de recebíveis")
public class ReceivableTypeController {

    private final ReceivableTypeService service;


    public ReceivableTypeController(ReceivableTypeService service) {
        this.service = service;
    }


    @GetMapping
    @Operation(summary = "List Receivable Types", description = "Lista todos os tipos de recebíveis disponíveis.")
    public ResponseEntity<Page<ReceivableTypeResponse>> findAll(Pageable pageable) {

        Page<ReceivableTypeResponse> receivableTypeResponses = service.findAll(pageable);
        return ResponseEntity.ok(receivableTypeResponses);
    }

    @PostMapping
    @Operation(summary = "Cadastrar tipo de recebível", description = "Cadastra um novo tipo de recebível.")
    public ResponseEntity<ReceivableTypeResponse> create(
            @Valid @RequestBody CreateReceivableType request
    ) {
        ReceivableTypeResponse response = service.create(request);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(location).body(response);


    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar tipo de recebível", description = "Atualiza um tipo de recebível existente.")
    public ResponseEntity<ReceivableTypeResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateReceivableType request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir tipo de recebível", description = "Exclui um tipo de recebível existente."
    )
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}