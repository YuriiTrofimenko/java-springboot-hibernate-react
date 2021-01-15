package org.tyaa.demo.springboot.simplespa.messaging;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class EventDispatcher {

    private RabbitTemplate rabbitTemplate;
    private String orderExchange;
    private String orderCompletedRoutingKey;

    public EventDispatcher(
            final RabbitTemplate rabbitTemplate,
            @Value("${rabbitmq.order.exchange}") final String orderExchange,
            @Value("${rabbitmq.order.completed.key}") final String orderCompletedRoutingKey
    ) {
        this.rabbitTemplate = rabbitTemplate;
        this.orderExchange = orderExchange;
        this.orderCompletedRoutingKey = orderCompletedRoutingKey;
    }

    public void send(final OrderCompletedEvent orderCompletedEvent) {
        rabbitTemplate.convertAndSend(
                orderExchange,
                orderCompletedRoutingKey,
                orderCompletedEvent
        );
    }
}