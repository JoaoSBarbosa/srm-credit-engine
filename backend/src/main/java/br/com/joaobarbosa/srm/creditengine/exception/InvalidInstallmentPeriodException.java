package br.com.joaobarbosa.srm.creditengine.exception;

public class InvalidInstallmentPeriodException extends BusinessException {
    public InvalidInstallmentPeriodException(long installments) {
        super("O prazo em parcelas deve ser maior que zero. Valor recebido: " + installments);
    }
}