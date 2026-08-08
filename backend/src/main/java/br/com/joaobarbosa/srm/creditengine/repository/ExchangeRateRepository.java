package br.com.joaobarbosa.srm.creditengine.repository;

import br.com.joaobarbosa.srm.creditengine.model.entity.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, UUID> {

    Optional<ExchangeRate> findFirstBySourceCurrencyIdAndTargetCurrencyIdOrderByReferenceDateDesc(UUID sourceId, UUID targetId);


}