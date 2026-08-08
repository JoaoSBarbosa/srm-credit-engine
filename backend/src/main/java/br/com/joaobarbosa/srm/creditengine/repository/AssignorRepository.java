package br.com.joaobarbosa.srm.creditengine.repository;

import br.com.joaobarbosa.srm.creditengine.model.entity.Assignor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AssignorRepository extends JpaRepository<Assignor, UUID> {

    Optional<Assignor> findByDocument(String document);
}
