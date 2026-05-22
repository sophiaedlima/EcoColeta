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
    public Solicitacao executar(String email, String endereco, String materiais, String observacoes, String imagens, String dataPreferida, String horarioPreferido) {
        var solicitacao = new Solicitacao();
        solicitacao.setSolicitanteEmail(email);
        solicitacao.setEndereco(endereco);
        solicitacao.setMateriais(materiais);
        solicitacao.setObservacoes(observacoes);
        solicitacao.setImagens(imagens);
        solicitacao.setDataPreferida(dataPreferida);
        solicitacao.setHorarioPreferido(horarioPreferido);
        return repository.save(solicitacao);
    }
}
