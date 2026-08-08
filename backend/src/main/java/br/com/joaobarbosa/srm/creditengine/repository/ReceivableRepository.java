package br.com.joaobarbosa.srm.creditengine.repository;

import br.com.joaobarbosa.srm.creditengine.model.entity.Receivable;
import br.com.joaobarbosa.srm.creditengine.model.enums.OperationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReceivableRepository extends JpaRepository<Receivable, UUID> {

    List<Receivable> findAllByStatus(OperationStatus status);
}
