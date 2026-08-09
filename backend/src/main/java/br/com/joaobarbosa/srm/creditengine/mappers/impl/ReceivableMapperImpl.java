package br.com.joaobarbosa.srm.creditengine.mappers.impl;

import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.CreateReceivableRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.UpdateReceivableRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.response.ReceivableResponse;
import br.com.joaobarbosa.srm.creditengine.mappers.ReceivableMapper;
import br.com.joaobarbosa.srm.creditengine.model.entity.Assignor;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;
import br.com.joaobarbosa.srm.creditengine.model.entity.Receivable;
import br.com.joaobarbosa.srm.creditengine.model.entity.ReceivableType;
import org.springframework.stereotype.Component;


@Component
public class ReceivableMapperImpl implements ReceivableMapper {


    @Override
    public Receivable toEntity(
            CreateReceivableRequest request,
            Assignor assignor,
            ReceivableType type,
            Currency currency
    ) {
        if (request == null) return null;
        Receivable entity = new Receivable();
        entity.setAssignor(assignor);
        entity.setReceivableType(type);
        entity.setCurrency(currency);
        entity.setFaceValue(request.faceValue());
        entity.setDueDate(request.dueDate());
        entity.setOperationDate(request.operationDate());
        entity.setBaseRate(request.baseRate());
        return entity;
    }


    @Override
    public void updateEntity(
            UpdateReceivableRequest request,
            Receivable entity,
            Assignor assignor,
            ReceivableType type,
            Currency currency
    ) {
        if (assignor != null) entity.setAssignor(assignor);
        if (type != null) entity.setReceivableType(type);
        if (currency != null) entity.setCurrency(currency);
        if (request.faceValue() != null) entity.setFaceValue(request.faceValue());
        if (request.dueDate() != null) entity.setDueDate(request.dueDate());
        if (request.baseRate() != null) entity.setBaseRate(request.baseRate());
    }


    @Override
    public ReceivableResponse toResponse(
            Receivable entity
    ) {

        if (entity == null) return null;
        return new ReceivableResponse(
                entity.getId(),
                entity.getAssignor().getId(),
                entity.getAssignor().getName(),
                entity.getReceivableType().getCode(),
                entity.getCurrency().getIsoCode(),
                entity.getCurrency().getId(),
                entity.getFaceValue(),
                entity.getStatus().name(),
                entity.getDueDate(),
                entity.getOperationDate(),
                entity.getBaseRate()
        );

    }

}