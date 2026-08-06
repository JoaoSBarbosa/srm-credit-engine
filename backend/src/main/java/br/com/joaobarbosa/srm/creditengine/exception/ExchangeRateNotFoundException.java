package br.com.joaobarbosa.srm.creditengine.exception;


import java.util.UUID;

public class ExchangeRateNotFoundException extends BusinessException {
    public ExchangeRateNotFoundException(String source, String target) {
        super("Taxa de câmbio não encontrada para o par: " + source + "->" + target);
    }
}