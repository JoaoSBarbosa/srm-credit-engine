package br.com.joaobarbosa.srm.creditengine.mappers;

import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.CreateReceivableRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.UpdateReceivableRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.response.ReceivableResponse;
import br.com.joaobarbosa.srm.creditengine.model.entity.Assignor;
import br.com.joaobarbosa.srm.creditengine.model.entity.Currency;
import br.com.joaobarbosa.srm.creditengine.model.entity.Receivable;
import br.com.joaobarbosa.srm.creditengine.model.entity.ReceivableType;

public interface ReceivableMapper {

    Receivable toEntity(
            CreateReceivableRequest request,
            Assignor assignor,
            ReceivableType type,
            Currency currency
    );

    void updateEntity(
            UpdateReceivableRequest request,
            Receivable entity,
            Assignor assignor,
            ReceivableType type,
            Currency currency
    );


    ReceivableResponse toResponse(
            Receivable entity
    );

}