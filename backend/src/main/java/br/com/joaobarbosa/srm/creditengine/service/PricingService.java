package br.com.joaobarbosa.srm.creditengine.service;

import br.com.joaobarbosa.srm.creditengine.dto.pricing.request.PricingRequest;
import br.com.joaobarbosa.srm.creditengine.dto.pricing.request.PricingSimulationRequest;
import br.com.joaobarbosa.srm.creditengine.dto.pricing.response.PricingResponse;
import br.com.joaobarbosa.srm.creditengine.dto.pricing.response.PricingSimulationResponse;

import java.util.UUID;

public interface PricingService {
    PricingResponse calculate(
            UUID receivableId,
            PricingRequest request
    );

    PricingSimulationResponse simulate(PricingSimulationRequest request);
}
