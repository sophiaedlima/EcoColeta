package com.ecocoleta.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

@Entity
@Table(name = "solicitacoes")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String solicitanteEmail;

    @Column(nullable = false)
    private String endereco;

    @Column(columnDefinition = "TEXT")
    private String materiais;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(columnDefinition = "TEXT")
    private String imagens;

    private String dataPreferida;

    private String horarioPreferido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusColeta status = StatusColeta.PENDENTE;

    @Column(nullable = false)
    private LocalDateTime criadoEm = LocalDateTime.now(ZoneId.of("America/Sao_Paulo"));

    private LocalDateTime atualizadoEm;

    @PreUpdate
    void preUpdate() {
        this.atualizadoEm = LocalDateTime.now(ZoneId.of("America/Sao_Paulo"));
    }

    public UUID getId() { return id; }
    public String getSolicitanteEmail() { return solicitanteEmail; }
    public void setSolicitanteEmail(String solicitanteEmail) { this.solicitanteEmail = solicitanteEmail; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public String getMateriais() { return materiais; }
    public void setMateriais(String materiais) { this.materiais = materiais; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public String getImagens() { return imagens; }
    public void setImagens(String imagens) { this.imagens = imagens; }
    public String getDataPreferida() { return dataPreferida; }
    public void setDataPreferida(String dataPreferida) { this.dataPreferida = dataPreferida; }
    public String getHorarioPreferido() { return horarioPreferido; }
    public void setHorarioPreferido(String horarioPreferido) { this.horarioPreferido = horarioPreferido; }
    public StatusColeta getStatus() { return status; }
    public void setStatus(StatusColeta status) { this.status = status; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
}
