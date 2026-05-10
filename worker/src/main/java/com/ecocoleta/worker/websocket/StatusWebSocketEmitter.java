package com.ecocoleta.worker.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class StatusWebSocketEmitter {

    private final SimpMessagingTemplate messagingTemplate;

    public StatusWebSocketEmitter(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void emitir(String solicitacaoId, String status) {
        messagingTemplate.convertAndSend(
                "/topic/coleta/" + solicitacaoId,
                new StatusPayload(solicitacaoId, status)
        );
    }

    public record StatusPayload(String solicitacaoId, String status) {}
}
