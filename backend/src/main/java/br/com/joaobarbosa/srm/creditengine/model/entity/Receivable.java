package br.com.joaobarbosa.srm.creditengine.model.entity;

import br.com.joaobarbosa.srm.creditengine.model.base.AuditableEntity;
import br.com.joaobarbosa.srm.creditengine.model.enums.OperationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "receivable")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@ToString(callSuper = true, exclude = {"assignor", "receivableType", "currency"})
public class Receivable extends AuditableEntity {


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignor_id", nullable = false)
    private Assignor assignor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receivable_type_id", nullable = false)
    private ReceivableType receivableType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "currency_id", nullable = false)
    private Currency currency;
    
    @Column(name = "base_rate", nullable = false, precision = 6, scale = 4)
    private BigDecimal baseRate;

    @Column(name = "face_value", nullable = false, precision = 18, scale = 2)
    private BigDecimal faceValue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OperationStatus status = OperationStatus.PENDING;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "operation_date", nullable = false)
    private LocalDate operationDate;


}