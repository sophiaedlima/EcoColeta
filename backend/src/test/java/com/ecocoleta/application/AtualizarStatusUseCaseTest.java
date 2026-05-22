package com.ecocoleta.application;

import com.ecocoleta.application.coleta.AtualizarStatusUseCase;
import com.ecocoleta.domain.Solicitacao;
import com.ecocoleta.domain.StatusColeta;
import com.ecocoleta.domain.events.StatusAtualizadoEvent;
import com.ecocoleta.infrastructure.messaging.RabbitMQPublisher;
import com.ecocoleta.infrastructure.persistence.SolicitacaoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AtualizarStatusUseCaseTest {

    @Mock
    SolicitacaoRepository repository;

    @Mock
    RabbitMQPublisher publisher;

    @InjectMocks
    AtualizarStatusUseCase useCase;

    @Test
    void deveAtualizarStatusEPublicarEvento() {
        var id = UUID.randomUUID();
        var solicitacao = new Solicitacao();
        solicitacao.setSolicitanteEmail("user@teste.com");
        solicitacao.setEndereco("Rua B, 10");

        when(repository.findById(id)).thenReturn(Optional.of(solicitacao));
        when(repository.save(any())).thenReturn(solicitacao);

        useCase.executar(id, StatusColeta.AGENDADO);

        assertThat(solicitacao.getStatus()).isEqualTo(StatusColeta.AGENDADO);

        var captor = ArgumentCaptor.forClass(StatusAtualizadoEvent.class);
        verify(publisher).publicar(captor.capture());
        assertThat(captor.getValue().solicitacaoId()).isEqualTo(id);
        assertThat(captor.getValue().novoStatus()).isEqualTo(StatusColeta.AGENDADO);
    }

    @Test
    void deveLancarExcecaoQuandoSolicitacaoNaoEncontrada() {
        var id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> useCase.executar(id, StatusColeta.CONCLUIDO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Solicitação não encontrada");

        verify(publisher, never()).publicar(any());
    }
}
