package br.com.joaobarbosa.srm.creditengine.exception;

import java.util.UUID;

public class ReceivableAlreadySettledException extends  RuntimeException{
    public ReceivableAlreadySettledException(UUID id) {
        super("Recebível já liquidado ou cancelado: " + id);
    }
}
