package br.com.joaobarbosa.srm.creditengine.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "SRM Credit Engine API",
                version = "1.0.0",
                description = """
                        API REST para gestão, precificação e liquidação
                        de recebíveis em operações de crédito multimoedas.
                        
                        ## Funcionalidades
                        
                        - Gestão de recebíveis
                        - Simulação de precificação
                        - Precificação e liquidação
                        - Gestão de moedas
                        - Gestão de taxas de câmbio
                        - Gestão de cedentes
                        - Gestão de tipos de recebíveis
                        - Consulta analítica de liquidações
                        
                        ## Arquitetura
                        
                        A aplicação utiliza uma arquitetura em camadas,
                        separando responsabilidades entre controllers,
                        serviços de aplicação e persistência.
                        """,
                contact = @Contact(
                        name = "SRM Credit Engine",
                        email = "contact@srmcredit.com"
                ),
                license = @License(
                        name = "Apache 2.0",
                        url = "https://www.apache.org/licenses/LICENSE-2.0"
                )
        )
)
public class OpenApiConfig {
}