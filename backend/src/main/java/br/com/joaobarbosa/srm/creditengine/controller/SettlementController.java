package br.com.joaobarbosa.srm.creditengine.controller;

import br.com.joaobarbosa.srm.creditengine.dto.settlement.request.SettlementFilterRequest;
import br.com.joaobarbosa.srm.creditengine.dto.settlement.response.SettlementResponse;
import br.com.joaobarbosa.srm.creditengine.service.SettlementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/settlements")
@Tag(name = "Settlement", description = "Endpoints para gerenciar liquidações")
public class SettlementController {


    private final SettlementService service;


    public SettlementController(SettlementService service) {
        this.service = service;
    }


    @GetMapping
    @Operation(summary = "List Settlements", description = "Lista todas as liquidações com base nos filtros fornecidos.")
    public ResponseEntity<Page<SettlementResponse>> findAll(
            SettlementFilterRequest filter,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {

        Page<SettlementResponse> settlements = service.findAll(filter, pageable);
        return ResponseEntity.ok(settlements);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Find Settlement by ID", description = "Retorna uma liquidação específica com base no ID fornecido.")
    public ResponseEntity<SettlementResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.findById(id));
    }
}