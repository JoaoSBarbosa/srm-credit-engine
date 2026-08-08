package br.com.joaobarbosa.srm.creditengine.exception;

public class UnsupportedReceivableTypeException extends BusinessException {
    public UnsupportedReceivableTypeException(String receivableTypeCode) {
        super("Nenhuma estratégia de precificação encontrada para o tipo: " + receivableTypeCode);
    }
}