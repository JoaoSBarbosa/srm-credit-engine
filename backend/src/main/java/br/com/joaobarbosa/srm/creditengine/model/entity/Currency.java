package br.com.joaobarbosa.srm.creditengine.model.entity;
import br.com.joaobarbosa.srm.creditengine.model.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "currency")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class Currency extends BaseEntity {

    @Column(name = "iso_code", nullable = false, unique = true, length = 3)
    private String isoCode;

    @Column(nullable = false, length = 100)
    private String name;


}
