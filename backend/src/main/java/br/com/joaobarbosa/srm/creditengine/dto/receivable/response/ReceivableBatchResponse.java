package br.com.joaobarbosa.srm.creditengine.dto.receivable.response;

import java.util.List;

public record ReceivableBatchResponse(
        int totalReceived,
        int totalCreated,
        List<ReceivableResponse> created
) {
}
