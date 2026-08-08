package br.com.joaobarbosa.srm.creditengine.exception;

import java.util.UUID;

public class DomainNotFoundException extends RuntimeException {
    public DomainNotFoundException(UUID id) {
        super("Não foi encontrado registros com id " + id);
    }
    
    protected DomainNotFoundException(String message) {
        super(message);
    }
}