package br.com.joaobarbosa.srm.creditengine.controller;

import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.CreateReceivableBatchRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.CreateReceivableRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.UpdateReceivableRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.response.ReceivableBatchResponse;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.response.ReceivableResponse;
import br.com.joaobarbosa.srm.creditengine.service.ReceivableService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/receivables")
public class ReceivableController {

    private final ReceivableService receivableService;

    public ReceivableController(ReceivableService receivableService) {
        this.receivableService = receivableService;
    }

    @PostMapping
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
    public ResponseEntity<ReceivableBatchResponse> createBatch(@RequestBody @Valid CreateReceivableBatchRequest batchRequest) {
        ReceivableBatchResponse response = receivableService.createBatch(batchRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ReceivableResponse> findById(@PathVariable UUID id
    ) {
        return ResponseEntity.ok(receivableService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReceivableResponse> update(
            @PathVariable UUID id,
            @RequestBody @Valid UpdateReceivableRequest request
    ) {

        return ResponseEntity.ok(receivableService.update(id, request));
    }
}