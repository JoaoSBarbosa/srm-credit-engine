package br.com.joaobarbosa.srm.creditengine.repository;

import br.com.joaobarbosa.srm.creditengine.model.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SettlementRepository extends JpaRepository<Settlement, UUID> {}