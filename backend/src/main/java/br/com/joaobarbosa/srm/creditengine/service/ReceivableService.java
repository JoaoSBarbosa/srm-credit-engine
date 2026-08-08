package br.com.joaobarbosa.srm.creditengine.service;

import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.CreateReceivableBatchRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.CreateReceivableRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.UpdateReceivableRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.response.ReceivableBatchResponse;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.response.ReceivableResponse;

import java.util.UUID;

public interface ReceivableService {

    ReceivableResponse create(CreateReceivableRequest request);

    ReceivableBatchResponse createBatch(CreateReceivableBatchRequest request);

    ReceivableResponse update(UUID id, UpdateReceivableRequest request);

    ReceivableResponse findById(UUID id);

    void delete(UUID id);
}
