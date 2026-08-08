package br.com.joaobarbosa.srm.creditengine.controller;

import br.com.joaobarbosa.srm.creditengine.dto.receivableType.reponse.ReceivableTypeResponse;
import br.com.joaobarbosa.srm.creditengine.service.ReceivableTypeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/receivable-types")
public class ReceivableTypeController {

    private final ReceivableTypeService service;


    public ReceivableTypeController(
            ReceivableTypeService service
    ) {
        this.service = service;
    }


    @GetMapping
    public ResponseEntity<Page<ReceivableTypeResponse>> findAll(Pageable pageable) {

        Page<ReceivableTypeResponse> receivableTypeResponses = service.findAll(pageable);
        return ResponseEntity.ok(receivableTypeResponses);
    }
}