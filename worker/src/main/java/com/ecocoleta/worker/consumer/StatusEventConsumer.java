package com.ecocoleta.worker.consumer;

import com.ecocoleta.worker.domain.StatusAtualizadoEvent;
import com.ecocoleta.worker.websocket.StatusWebSocketEmitter;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class StatusEventConsumer {

    private final StatusWebSocketEmitter emitter;

    public StatusEventConsumer(StatusWebSocketEmitter emitter) {
        this.emitter = emitter;
    }

    @RabbitListener(queues = "${rabbitmq.queue.status}")
    public void consumir(StatusAtualizadoEvent event) {
        emitter.emitir(event.solicitacaoId().toString(), event.novoStatus());
    }
}
