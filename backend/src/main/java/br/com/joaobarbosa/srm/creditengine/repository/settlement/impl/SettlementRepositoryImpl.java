package br.com.joaobarbosa.srm.creditengine.repository.settlement.impl;

import br.com.joaobarbosa.srm.creditengine.dto.settlement.request.SettlementFilterRequest;
import br.com.joaobarbosa.srm.creditengine.dto.settlement.response.SettlementResponse;
import br.com.joaobarbosa.srm.creditengine.repository.settlement.SettlementRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
public class SettlementRepositoryImpl implements SettlementRepositoryCustom {

    private final EntityManager entityManager;

    private static final String BASE_FROM = """
            FROM settlement s
            INNER JOIN receivable r ON r.id = s.receivable_id
            INNER JOIN assignor a ON a.id = r.assignor_id
            INNER JOIN receivable_type rt ON rt.id = r.receivable_type_id
            INNER JOIN currency c ON c.id = s.payment_currency_id
            """;

    public SettlementRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Page<SettlementResponse> findByFilter(
            SettlementFilterRequest filter,
            Pageable pageable
    ) {

        String whereClause = buildWhereClause(filter);

        String selectSql = """
                SELECT
                    s.id,
                    r.id,
                    a.name,
                    rt.name,
                    c.iso_code,
                    r.face_value,
                    s.present_value,
                    s.applied_exchange_rate,
                    s.net_amount,
                    s.status,
                    s.created_at
                """ + BASE_FROM + whereClause + """
                ORDER BY s.created_at DESC
                LIMIT %d OFFSET %d
                """.formatted(
                pageable.getPageSize(),
                pageable.getOffset()
        );

        Query dataQuery = entityManager.createNativeQuery(selectSql);
        bindParams(dataQuery, filter);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = dataQuery.getResultList();

        List<SettlementResponse> content = rows.stream()
                .map(this::mapToResponse)
                .toList();

        String countSql = """
                SELECT COUNT(*)
                """ + BASE_FROM + whereClause;

        Query countQuery = entityManager.createNativeQuery(countSql);
        bindParams(countQuery, filter);
        long total = ((Number) countQuery.getSingleResult()).longValue();
        return new PageImpl<>(content, pageable, total);
    }

    private String buildWhereClause(SettlementFilterRequest filter) {

        List<String> conditions = new ArrayList<>();
        if (filter.assignorName() != null && !filter.assignorName().isBlank())
            conditions.add("a.name ILIKE CONCAT('%', :assignorName, '%')");
        if (filter.currencyIso() != null && !filter.currencyIso().isBlank())
            conditions.add("c.iso_code = :currencyIso");
        if (filter.receivableTypeCode() != null && !filter.receivableTypeCode().isBlank())
            conditions.add("rt.code = :receivableTypeCode");
        if (filter.status() != null && !filter.status().isBlank())
            conditions.add("s.status = :status");
        if (filter.startDate() != null)
            conditions.add("s.created_at >= :startDate");
        if (filter.endDate() != null) conditions.add("s.created_at < :endDate");
        if (conditions.isEmpty()) return "";

        return "WHERE " + String.join("\nAND ", conditions) + "\n";
    }

    private void bindParams(Query query, SettlementFilterRequest filter
    ) {

        if (filter.assignorName() != null && !filter.assignorName().isBlank())
            query.setParameter("assignorName", filter.assignorName());

        if (filter.currencyIso() != null && !filter.currencyIso().isBlank())
            query.setParameter("currencyIso", filter.currencyIso());

        if (filter.receivableTypeCode() != null && !filter.receivableTypeCode().isBlank())
            query.setParameter("receivableTypeCode", filter.receivableTypeCode());

        if (filter.status() != null && !filter.status().isBlank()) query.setParameter("status", filter.status());

        LocalDate startDate = filter.startDate();
        if (startDate != null) query.setParameter("startDate", startDate.atStartOfDay());

        LocalDate endDate = filter.endDate();
        if (endDate != null) query.setParameter("endDate", endDate.plusDays(1).atStartOfDay());

    }

    private SettlementResponse mapToResponse(Object[] row) {

        return new SettlementResponse(
                (UUID) row[0],
                (UUID) row[1],
                (String) row[2],
                (String) row[3],
                (String) row[4],
                (BigDecimal) row[5],
                (BigDecimal) row[6],
                (BigDecimal) row[7],
                (BigDecimal) row[8],
                (String) row[9],
                ((LocalDateTime) row[10])
        );
    }
}