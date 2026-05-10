package com.ecocoleta.application.solicitacao;

import com.ecocoleta.domain.Solicitacao;
import com.ecocoleta.infrastructure.persistence.SolicitacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CriarSolicitacaoUseCase {

    private final SolicitacaoRepository repository;

    public CriarSolicitacaoUseCase(SolicitacaoRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Solicitacao executar(String email, String endereco) {
        var solicitacao = new Solicitacao();
        solicitacao.setSolicitanteEmail(email);
        solicitacao.setEndereco(endereco);
        return repository.save(solicitacao);
    }
}
