package br.com.joaobarbosa.srm.creditengine.repository;

import br.com.joaobarbosa.srm.creditengine.model.entity.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, UUID> {

    @Query("""
        SELECT er FROM ExchangeRate er
        WHERE er.sourceCurrency.id = :sourceId
          AND er.targetCurrency.id = :targetId
        ORDER BY er.referenceDate DESC
        LIMIT 1
        """)
    Optional<ExchangeRate> findLatestRate(UUID sourceId, UUID targetId);
}