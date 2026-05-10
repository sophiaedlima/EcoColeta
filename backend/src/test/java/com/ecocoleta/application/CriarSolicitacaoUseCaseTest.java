package com.ecocoleta.application;

import com.ecocoleta.application.solicitacao.CriarSolicitacaoUseCase;
import com.ecocoleta.domain.Solicitacao;
import com.ecocoleta.domain.StatusColeta;
import com.ecocoleta.infrastructure.persistence.SolicitacaoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CriarSolicitacaoUseCaseTest {

    @Mock
    SolicitacaoRepository repository;

    @InjectMocks
    CriarSolicitacaoUseCase useCase;

    @Test
    void deveCriarSolicitacaoComStatusPendente() {
        var esperado = new Solicitacao();
        esperado.setSolicitanteEmail("user@teste.com");
        esperado.setEndereco("Rua A, 123");
        when(repository.save(any())).thenReturn(esperado);

        var resultado = useCase.executar("user@teste.com", "Rua A, 123");

        assertThat(resultado.getStatus()).isEqualTo(StatusColeta.PENDENTE);
        assertThat(resultado.getSolicitanteEmail()).isEqualTo("user@teste.com");
    }
}
