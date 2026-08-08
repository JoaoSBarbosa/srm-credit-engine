package br.com.joaobarbosa.srm.creditengine.model.entity;

import br.com.joaobarbosa.srm.creditengine.model.base.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
@Table(name = "exchange_rate")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@ToString(callSuper = true, exclude = {"targetCurrency", "sourceCurrency"})
public class ExchangeRate extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_currency_id", nullable = false)
    private Currency targetCurrency;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_currency_id", nullable = false)
    private Currency sourceCurrency;

    @Column(name = "exchange_rate", nullable = false, precision = 18, scale = 6)
    private BigDecimal rate;

    @Column(name = "reference_date", nullable = false)
    private LocalDate referenceDate;


}