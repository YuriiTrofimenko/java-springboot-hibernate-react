package org.tyaa.demo.springboot.brokerage.broker.messaging;

import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class EventHandler {

    @RabbitListener(queues = "${rabbitmq.order.queue}")
    void handleTranslationCompleted(final OrderCompletedEvent event) {
        try {
            System.out.println("*** New Order ***");
            System.out.println("ID = " + event.getOrderId());
            System.out.println("Order Items:");
            event.getCart().getCartItems().forEach(System.out::println);
        } catch (final Exception e) {
            throw new AmqpRejectAndDontRequeueException(e);
        }
    }
}
