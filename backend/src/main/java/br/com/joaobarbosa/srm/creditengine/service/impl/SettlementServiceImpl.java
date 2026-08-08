package br.com.joaobarbosa.srm.creditengine.service.impl;

import br.com.joaobarbosa.srm.creditengine.dto.settlement.request.SettlementFilterRequest;
import br.com.joaobarbosa.srm.creditengine.dto.settlement.response.SettlementResponse;
import br.com.joaobarbosa.srm.creditengine.exception.DomainNotFoundException;
import br.com.joaobarbosa.srm.creditengine.mappers.SettlementMapper;
import br.com.joaobarbosa.srm.creditengine.repository.settlement.SettlementRepository;
import br.com.joaobarbosa.srm.creditengine.repository.settlement.SettlementRepositoryCustom;
import br.com.joaobarbosa.srm.creditengine.service.SettlementService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class SettlementServiceImpl implements SettlementService {
    private final SettlementRepositoryCustom nativeRepository;
    private final SettlementRepository settlementRepository;
    private final SettlementMapper settlementMapper;

    public SettlementServiceImpl(
            SettlementRepositoryCustom nativeRepository,
            SettlementRepository settlementRepository,
            SettlementMapper settlementMapper
    ) {
        this.nativeRepository = nativeRepository;
        this.settlementRepository = settlementRepository;
        this.settlementMapper = settlementMapper;
    }


    @Override
    public SettlementResponse findById(UUID id) {

        return settlementRepository.findById(id)
                .map(settlementMapper::toResponse)
                .orElseThrow(() -> new DomainNotFoundException(id));
    }

    @Override
    public Page<SettlementResponse> findAll(SettlementFilterRequest filter, Pageable pageable) {

        return nativeRepository.findByFilter(filter, pageable);

    }
}