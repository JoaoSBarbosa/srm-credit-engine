package br.com.joaobarbosa.srm.creditengine.exception;


public abstract class BusinessException extends RuntimeException {
    protected BusinessException(String message) {
        super(message);
    }
}