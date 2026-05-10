package com.ecocoleta.adapters;

import com.ecocoleta.application.agendamento.AgendarColetaUseCase;
import com.ecocoleta.application.coleta.AtualizarStatusUseCase;
import com.ecocoleta.domain.Agendamento;
import com.ecocoleta.domain.StatusColeta;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/agendamentos")
@Tag(name = "Agendamentos")
@SecurityRequirement(name = "bearerAuth")
public class AgendamentoController {

    private final AgendarColetaUseCase agendarUseCase;
    private final AtualizarStatusUseCase atualizarStatusUseCase;

    public AgendamentoController(AgendarColetaUseCase agendarUseCase,
                                  AtualizarStatusUseCase atualizarStatusUseCase) {
        this.agendarUseCase = agendarUseCase;
        this.atualizarStatusUseCase = atualizarStatusUseCase;
    }

    @Operation(summary = "Agenda uma coleta para uma solicitação (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Agendamento> agendar(@Valid @RequestBody AgendarRequest req) {
        var agendamento = agendarUseCase.executar(req.solicitacaoId(), req.dataHora(), req.coletor());
        return ResponseEntity.ok(agendamento);
    }

    @Operation(summary = "Atualiza o status de uma coleta (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{solicitacaoId}/status")
    public ResponseEntity<Void> atualizarStatus(
            @PathVariable UUID solicitacaoId,
            @RequestBody AtualizarStatusRequest req) {
        atualizarStatusUseCase.executar(solicitacaoId, req.status());
        return ResponseEntity.noContent().build();
    }

    public record AgendarRequest(
            @NotNull UUID solicitacaoId,
            @NotNull LocalDateTime dataHora,
            @NotBlank String coletor
    ) {}

    public record AtualizarStatusRequest(@NotNull StatusColeta status) {}
}
