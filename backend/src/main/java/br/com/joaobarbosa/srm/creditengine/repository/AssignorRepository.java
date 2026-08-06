package br.com.joaobarbosa.srm.creditengine.repository;
import br.com.joaobarbosa.srm.creditengine.model.entity.Receivable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
public interface AssignorRepository extends JpaRepository<Receivable, UUID> {
}
