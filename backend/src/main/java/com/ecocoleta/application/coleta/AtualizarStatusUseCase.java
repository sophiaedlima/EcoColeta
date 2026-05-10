package com.ecocoleta.application.coleta;

import com.ecocoleta.domain.StatusColeta;
import com.ecocoleta.domain.events.StatusAtualizadoEvent;
import com.ecocoleta.infrastructure.messaging.RabbitMQPublisher;
import com.ecocoleta.infrastructure.persistence.SolicitacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AtualizarStatusUseCase {

    private final SolicitacaoRepository repository;
    private final RabbitMQPublisher publisher;

    public AtualizarStatusUseCase(SolicitacaoRepository repository, RabbitMQPublisher publisher) {
        this.repository = repository;
        this.publisher = publisher;
    }

    @Transactional
    public void executar(UUID solicitacaoId, StatusColeta novoStatus) {
        var solicitacao = repository.findById(solicitacaoId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada: " + solicitacaoId));

        solicitacao.setStatus(novoStatus);
        repository.save(solicitacao);

        publisher.publicar(new StatusAtualizadoEvent(solicitacaoId, novoStatus));
    }
}
