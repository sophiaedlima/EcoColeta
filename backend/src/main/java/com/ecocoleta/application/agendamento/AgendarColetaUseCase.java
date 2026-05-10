package com.ecocoleta.application.agendamento;

import com.ecocoleta.domain.Agendamento;
import com.ecocoleta.domain.StatusColeta;
import com.ecocoleta.domain.events.StatusAtualizadoEvent;
import com.ecocoleta.infrastructure.messaging.RabbitMQPublisher;
import com.ecocoleta.infrastructure.persistence.AgendamentoRepository;
import com.ecocoleta.infrastructure.persistence.SolicitacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AgendarColetaUseCase {

    private final SolicitacaoRepository solicitacaoRepository;
    private final AgendamentoRepository agendamentoRepository;
    private final RabbitMQPublisher publisher;

    public AgendarColetaUseCase(SolicitacaoRepository solicitacaoRepository,
                                 AgendamentoRepository agendamentoRepository,
                                 RabbitMQPublisher publisher) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.agendamentoRepository = agendamentoRepository;
        this.publisher = publisher;
    }

    @Transactional
    public Agendamento executar(UUID solicitacaoId, LocalDateTime dataHora, String coletor) {
        var solicitacao = solicitacaoRepository.findById(solicitacaoId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada: " + solicitacaoId));

        solicitacao.setStatus(StatusColeta.AGENDADO);
        solicitacaoRepository.save(solicitacao);

        var agendamento = new Agendamento();
        agendamento.setSolicitacao(solicitacao);
        agendamento.setDataHoraAgendada(dataHora);
        agendamento.setColetorResponsavel(coletor);
        agendamentoRepository.save(agendamento);

        publisher.publicar(new StatusAtualizadoEvent(solicitacaoId, StatusColeta.AGENDADO));

        return agendamento;
    }
}
