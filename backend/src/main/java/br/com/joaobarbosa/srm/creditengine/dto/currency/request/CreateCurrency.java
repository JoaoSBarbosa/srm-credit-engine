package br.com.joaobarbosa.srm.creditengine.dto.currency.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCurrency(

        @NotBlank(message = "O código ISO é obrigatório")
        @Size(min = 3, max = 3, message = "O código ISO deve possuir 3 caracteres")
        String isoCode,

        @NotBlank(message = "O nome da moeda é obrigatório")
        @Size(max = 100, message = "O nome da moeda deve possuir no máximo 100 caracteres")
        String name
) {
}