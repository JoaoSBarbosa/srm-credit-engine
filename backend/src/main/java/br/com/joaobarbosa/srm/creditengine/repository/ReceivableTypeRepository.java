package br.com.joaobarbosa.srm.creditengine.repository;

import br.com.joaobarbosa.srm.creditengine.model.entity.ReceivableType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ReceivableTypeRepository extends JpaRepository<ReceivableType, UUID> {
    Optional<ReceivableType> findByCode(String isoCode);
}