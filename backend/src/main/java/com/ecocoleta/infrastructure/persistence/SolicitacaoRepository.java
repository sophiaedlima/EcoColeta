package com.ecocoleta.infrastructure.persistence;

import com.ecocoleta.domain.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, UUID> {
    List<Solicitacao> findBySolicitanteEmailOrderByCriadoEmDesc(String email);
}
