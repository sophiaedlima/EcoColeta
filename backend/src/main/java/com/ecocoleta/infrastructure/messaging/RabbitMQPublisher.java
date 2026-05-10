package com.ecocoleta.infrastructure.messaging;

import com.ecocoleta.domain.events.StatusAtualizadoEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing-key.status}")
    private String routingKey;

    public RabbitMQPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publicar(StatusAtualizadoEvent event) {
        rabbitTemplate.convertAndSend(exchange, routingKey, event);
    }
}
