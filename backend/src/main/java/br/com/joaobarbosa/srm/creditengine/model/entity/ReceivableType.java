package br.com.joaobarbosa.srm.creditengine.model.entity;
import br.com.joaobarbosa.srm.creditengine.model.base.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;


import java.math.BigDecimal;

@Entity
@Table(name = "receivable_type")
@Getter @Setter @NoArgsConstructor
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@ToString(callSuper = true)
public class ReceivableType extends AuditableEntity {



    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "spread_rate", nullable = false, precision = 6, scale = 4)
    private BigDecimal spreadRate;


}
