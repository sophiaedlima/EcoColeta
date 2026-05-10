package com.ecocoleta.application.solicitacao;

import com.ecocoleta.domain.Solicitacao;
import com.ecocoleta.infrastructure.persistence.SolicitacaoRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ListarSolicitacoesUseCase {

    private final SolicitacaoRepository repository;

    public ListarSolicitacoesUseCase(SolicitacaoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Solicitacao> executar() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return repository.findBySolicitanteEmailOrderByCriadoEmDesc(email);
    }

    @Transactional(readOnly = true)
    public List<Solicitacao> executarTodas() {
        return repository.findAll();
    }
}
