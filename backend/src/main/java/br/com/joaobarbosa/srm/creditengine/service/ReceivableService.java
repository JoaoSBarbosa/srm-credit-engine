package br.com.joaobarbosa.srm.creditengine.service;

import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.CreateReceivableBatchRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.CreateReceivableRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.request.UpdateReceivableRequest;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.response.ReceivableBatchResponse;
import br.com.joaobarbosa.srm.creditengine.dto.receivable.response.ReceivableResponse;

import java.util.List;
import java.util.UUID;

public interface ReceivableService {

    ReceivableResponse create(CreateReceivableRequest request);

    ReceivableBatchResponse createBatch(CreateReceivableBatchRequest request);

    ReceivableResponse update(UUID id, UpdateReceivableRequest request);

    ReceivableResponse findById(UUID id);

    List<ReceivableResponse> findPending();

    void delete(UUID id);
}
