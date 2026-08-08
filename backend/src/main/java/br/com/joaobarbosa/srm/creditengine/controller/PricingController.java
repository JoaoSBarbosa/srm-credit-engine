package br.com.joaobarbosa.srm.creditengine.controller;

import br.com.joaobarbosa.srm.creditengine.dto.pricing.request.PricingRequest;
import br.com.joaobarbosa.srm.creditengine.dto.pricing.request.PricingSimulationRequest;
import br.com.joaobarbosa.srm.creditengine.dto.pricing.response.PricingResponse;
import br.com.joaobarbosa.srm.creditengine.dto.pricing.response.PricingSimulationResponse;
import br.com.joaobarbosa.srm.creditengine.service.PricingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pricings")
public class PricingController {

    private final PricingService pricingService;

    public PricingController(PricingService pricingService) {
        this.pricingService = pricingService;
    }


    @PostMapping("/receivables/{receivableId}/settle")
    public ResponseEntity<PricingResponse> calculate(
            @PathVariable UUID receivableId,
            @RequestBody @Valid PricingRequest request
    ) {

        PricingResponse response = pricingService.calculate(receivableId, request);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(response.settlementId()).toUri();

        return ResponseEntity.created(location).body(response);
    }


    @PostMapping("/receivables/simulate")
    public ResponseEntity<PricingSimulationResponse> simulate(
            @RequestBody @Valid PricingSimulationRequest request
    ) {

        PricingSimulationResponse response = pricingService.simulate(request);
        return ResponseEntity.ok(response);
    }

}