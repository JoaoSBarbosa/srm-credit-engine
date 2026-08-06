package br.com.joaobarbosa.srm.creditengine.config;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "srm.pricing")
public class PricingProperties {


    private BigDecimal baseRate;

}
