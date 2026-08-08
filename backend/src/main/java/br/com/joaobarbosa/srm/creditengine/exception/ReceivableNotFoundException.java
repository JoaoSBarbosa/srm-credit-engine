package br.com.joaobarbosa.srm.creditengine.exception;

import java.util.UUID;

public class ReceivableNotFoundException extends DomainNotFoundException {
    public ReceivableNotFoundException(UUID id) {
        super("Recebível não encontrado: " + id);
    }
}