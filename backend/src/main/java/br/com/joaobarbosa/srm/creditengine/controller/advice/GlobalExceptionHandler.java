package br.com.joaobarbosa.srm.creditengine.controller.advice;

import br.com.joaobarbosa.srm.creditengine.exception.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler({DomainNotFoundException.class, ExchangeRateNotFoundException.class})
    public ResponseEntity<Map<String, Object>> notFound(RuntimeException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler({
            ReceivableAlreadySettledException.class,
            UnsupportedReceivableTypeException.class,
            InvalidInstallmentPeriodException.class
    })
    public ResponseEntity<Map<String, Object>> conflictOrBadRequest(RuntimeException ex) {
        return build(HttpStatus.UNPROCESSABLE_CONTENT, ex.getMessage());
    }

    @ExceptionHandler({DataIntegrityViolationException.class, InvalidDocumentException.class})
    public ResponseEntity<Map<String, Object>> integrity(RuntimeException ex) {

        String message = ex instanceof DataIntegrityViolationException
                ? "Violação de integridade: registro duplicado ou referência inválida."
                : ex.getMessage();

        return build(HttpStatus.CONFLICT, message);
    }

    @ExceptionHandler(InvalidDataAccessApiUsageException.class)
    public ResponseEntity<Map<String, Object>> invalidDataAccessApiUsage(
            InvalidDataAccessApiUsageException ex
    ) {
        return build(
                HttpStatus.BAD_REQUEST,
                "Parâmetro de paginação ou ordenação inválido."
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validation(MethodArgumentNotValidException ex) {

        Map<String, Object> body = base(HttpStatus.BAD_REQUEST, "Erro de validação");

        Map<String, String> fields = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(field ->
                        fields.put(
                                field.getField(),
                                field.getDefaultMessage()
                        )
                );

        body.put("fields", fields);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> generic(Exception ex) {
        log.error("Erro interno inesperado.", ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno inesperado."
        );
    }

    private ResponseEntity<Map<String, Object>> build(HttpStatus status, String message) {
        return ResponseEntity
                .status(status)
                .body(base(status, message));
    }

    private Map<String, Object> base(HttpStatus status, String message) {

        Map<String, Object> body = new HashMap<>();

        body.put("timestamp", Instant.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);

        return body;
    }
}