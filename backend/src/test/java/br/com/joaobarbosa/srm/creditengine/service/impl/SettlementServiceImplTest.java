package br.com.joaobarbosa.srm.creditengine.service.impl;


import br.com.joaobarbosa.srm.creditengine.dto.settlement.request.SettlementFilterRequest;
import br.com.joaobarbosa.srm.creditengine.dto.settlement.response.SettlementResponse;
import br.com.joaobarbosa.srm.creditengine.exception.DomainNotFoundException;
import br.com.joaobarbosa.srm.creditengine.mappers.SettlementMapper;
import br.com.joaobarbosa.srm.creditengine.model.entity.Settlement;
import br.com.joaobarbosa.srm.creditengine.repository.settlement.SettlementRepository;
import br.com.joaobarbosa.srm.creditengine.repository.settlement.SettlementRepositoryCustom;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("SettlementServiceImpl")
public class SettlementServiceImplTest {

    @Mock
    private SettlementRepositoryCustom nativeRepository;
    @Mock
    private SettlementRepository settlementRepository;
    @Mock
    private SettlementMapper settlementMapper;

    @InjectMocks
    private SettlementServiceImpl service;


    @Test
    @DisplayName("Deve repassar filtros e paginação para o repositorio nativo")
    void shouldDelegateFilterAndPaginationToNativeRepository() {
        SettlementFilterRequest filter = new SettlementFilterRequest(
                "Acme",
                "USD",
                "DUPLICATA_MERCANTIL",
                "SETTLED",
                LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 31)
        );

        Pageable pageable = PageRequest.of(0, 20);

        SettlementResponse item = new SettlementResponse(
                UUID.randomUUID(), UUID.randomUUID(), "Acme Ltda", "Duplicata Mercantil", "USD",
                new BigDecimal("1000.00"), new BigDecimal("985.22"), new BigDecimal("0.18"),
                new BigDecimal("177.34"), "SETTLED", LocalDateTime.now()
        );

        Page<SettlementResponse> expectedPage = new PageImpl<>(List.of(item), pageable, 1);
        when(nativeRepository.findByFilter(filter, pageable)).thenReturn(expectedPage);
        Page<SettlementResponse> result = service.findAll(filter, pageable);
        assertEquals(1, result.getTotalElements());
        assertEquals("Acme Ltda", result.getContent().getFirst().assignorName());
        ArgumentCaptor<SettlementFilterRequest> filterCaptor = ArgumentCaptor.forClass(SettlementFilterRequest.class);
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(nativeRepository).findByFilter(filterCaptor.capture(), pageableCaptor.capture());
        assertEquals("Acme", filterCaptor.getValue().assignorName());
        assertEquals(20, pageableCaptor.getValue().getPageSize());
    }

    @Test
    @DisplayName("Deve retornar página vazia quando nenhum registro casa com o filtro")
    void shouldReturnEmptyPageWhenNoMatch() {

        SettlementFilterRequest filter = new SettlementFilterRequest(null, "EUR", null, null, null, null);
        Pageable pageable = PageRequest.of(0, 20);
        when(nativeRepository.findByFilter(filter, pageable)).thenReturn(Page.empty(pageable));
        Page<SettlementResponse> result = service.findAll(filter, pageable);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Deve retornar a liquidação mapeada quando o id existe")
    void shouldReturnSettlementWhenIdExists() {

        UUID id = UUID.randomUUID();
        Settlement entity = new Settlement();
        SettlementResponse response = new SettlementResponse(
                id, UUID.randomUUID(), "Acme Ltda", "Duplicata Mercantil", "USD",
                new BigDecimal("1000.00"), new BigDecimal("985.22"), new BigDecimal("0.18"),
                new BigDecimal("177.34"), "SETTLED", LocalDateTime.now()
        );

        when(settlementRepository.findById(id)).thenReturn(Optional.of(entity));
        when(settlementMapper.toResponse(entity)).thenReturn(response);
        SettlementResponse result = service.findById(id);
        assertEquals(response, result);
    }

    @Test
    @DisplayName("Deve lançar DomainNotFoundException quando o id não existe")
    void shouldThrowWhenIdDoesNotExist() {
        UUID id = UUID.randomUUID();
        when(settlementRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(DomainNotFoundException.class, () -> service.findById(id));
    }
}
