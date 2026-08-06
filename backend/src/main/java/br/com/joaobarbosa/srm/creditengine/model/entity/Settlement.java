package br.com.joaobarbosa.srm.creditengine.model.entity;
import br.com.joaobarbosa.srm.creditengine.model.base.BaseEntity;
import br.com.joaobarbosa.srm.creditengine.model.enums.OperationStatus;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "settlement")
@Getter @Setter @NoArgsConstructor
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@ToString(callSuper = true, exclude = {"receivable", "paymentCurrency"})
public class Settlement extends BaseEntity {


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receivable_id", nullable = false)
    private Receivable receivable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_currency_id", nullable = false)
    private Currency paymentCurrency;

    @Column(name = "present_value", nullable = false, precision = 18, scale = 2)
    private BigDecimal presentValue;

    @Column(name = "applied_exchange_rate", precision = 18, scale = 6)
    private BigDecimal appliedExchangeRate;

    @Column(name = "net_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal netAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OperationStatus status = OperationStatus.SETTLED;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
