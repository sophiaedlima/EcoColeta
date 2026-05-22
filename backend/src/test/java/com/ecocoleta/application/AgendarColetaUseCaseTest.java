package com.ecocoleta.application;

import com.ecocoleta.application.agendamento.AgendarColetaUseCase;
import com.ecocoleta.domain.Agendamento;
import com.ecocoleta.domain.Solicitacao;
import com.ecocoleta.domain.StatusColeta;
import com.ecocoleta.domain.events.StatusAtualizadoEvent;
import com.ecocoleta.infrastructure.messaging.RabbitMQPublisher;
import com.ecocoleta.infrastructure.persistence.AgendamentoRepository;
import com.ecocoleta.infrastructure.persistence.SolicitacaoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AgendarColetaUseCaseTest {

    @Mock
    SolicitacaoRepository solicitacaoRepository;

    @Mock
    AgendamentoRepository agendamentoRepository;

    @Mock
    RabbitMQPublisher publisher;

    @InjectMocks
    AgendarColetaUseCase useCase;

    @Test
    void deveCriarAgendamentoEPublicarStatusAgendado() {
        var id = UUID.randomUUID();
        var solicitacao = new Solicitacao();
        solicitacao.setSolicitanteEmail("user@teste.com");
        solicitacao.setEndereco("Rua C, 5");

        var agendamento = new Agendamento();
        agendamento.setSolicitacao(solicitacao);

        when(solicitacaoRepository.findById(id)).thenReturn(Optional.of(solicitacao));
        when(solicitacaoRepository.save(any())).thenReturn(solicitacao);
        when(agendamentoRepository.save(any())).thenReturn(agendamento);

        var dataHora = LocalDateTime.of(2026, 5, 22, 10, 0);
        var resultado = useCase.executar(id, dataHora, "João Coletor");

        assertThat(solicitacao.getStatus()).isEqualTo(StatusColeta.AGENDADO);
        assertThat(resultado.getColetorResponsavel()).isEqualTo("João Coletor");

        var captor = ArgumentCaptor.forClass(StatusAtualizadoEvent.class);
        verify(publisher).publicar(captor.capture());
        assertThat(captor.getValue().novoStatus()).isEqualTo(StatusColeta.AGENDADO);
    }

    @Test
    void deveLancarExcecaoQuandoSolicitacaoNaoExiste() {
        var id = UUID.randomUUID();
        when(solicitacaoRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> useCase.executar(id, LocalDateTime.now(), "Coletor"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Solicitação não encontrada");

        verify(agendamentoRepository, never()).save(any());
        verify(publisher, never()).publicar(any());
    }
}
