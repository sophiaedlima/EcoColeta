package com.ecocoleta.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "agendamentos")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private Solicitacao solicitacao;

    @Column(nullable = false)
    private LocalDateTime dataHoraAgendada;

    @Column(nullable = false)
    private String coletorResponsavel;

    @Column(nullable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    public UUID getId() { return id; }
    public Solicitacao getSolicitacao() { return solicitacao; }
    public void setSolicitacao(Solicitacao solicitacao) { this.solicitacao = solicitacao; }
    public LocalDateTime getDataHoraAgendada() { return dataHoraAgendada; }
    public void setDataHoraAgendada(LocalDateTime dataHoraAgendada) { this.dataHoraAgendada = dataHoraAgendada; }
    public String getColetorResponsavel() { return coletorResponsavel; }
    public void setColetorResponsavel(String coletorResponsavel) { this.coletorResponsavel = coletorResponsavel; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
}
