package org.tyaa.demo.springboot.brokerage.broker.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.math.BigDecimal;

/* Товар в корзине */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CartItem {
    public enum Action {
        ADD // добавить один пункт товара в корзину
        , SUB // убрать один пункт товара из корзины
        , REM // убрать все пункты товара из корзины
    }
    private Long id;
    private Long productId;
    private String name;
    private BigDecimal price;
    private Integer quantity;
}
