package br.com.joaobarbosa.srm.creditengine.controller;

import br.com.joaobarbosa.srm.creditengine.dto.assignor.response.AssignorResponse;
import br.com.joaobarbosa.srm.creditengine.service.AssignorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assignor")
@Tag(name = "Assignors", description = "Operações de consulta de cedentes")
public class AssignorController {

    private final AssignorService assignorService;

    public AssignorController(AssignorService assignorService) {
        this.assignorService = assignorService;
    }


    @GetMapping("/{id}")
    @Operation(summary = "Buscar cedente", description = "Retorna um cedente pelo seu identificador.")
    public ResponseEntity<AssignorResponse> findById(@PathVariable UUID id
    ) {
        AssignorResponse assignorResponse = assignorService.findById(id);
        return ResponseEntity.ok(assignorResponse);
    }

    @GetMapping
    @Operation(summary = "Listar cedentes", description = "Retorna uma página de cedentes.")
    public ResponseEntity<Page<AssignorResponse>> findAll(@ParameterObject Pageable pageable) {

        Page<AssignorResponse> assignorResponses = assignorService.findAll(pageable);
        return ResponseEntity.ok(assignorResponses);
    }

}
