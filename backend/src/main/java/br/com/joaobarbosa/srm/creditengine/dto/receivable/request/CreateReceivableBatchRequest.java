package br.com.joaobarbosa.srm.creditengine.dto.receivable.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateReceivableBatchRequest(

        @NotEmpty(message = "O lote deve conter ao menos um recevível")
        @Size(max = 500, message = "O lote não pode exceder 500 recebíveis por requisição")
        @Valid
        List<CreateReceivableRequest> receivables
) {
}
