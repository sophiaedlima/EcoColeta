package com.ecocoleta.adapters;

import com.ecocoleta.application.solicitacao.CriarSolicitacaoUseCase;
import com.ecocoleta.application.solicitacao.ListarSolicitacoesUseCase;
import com.ecocoleta.domain.Solicitacao;
import com.ecocoleta.infrastructure.persistence.SolicitacaoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/solicitacoes")
@Tag(name = "Solicitações")
@SecurityRequirement(name = "bearerAuth")
public class SolicitacaoController {

    private final CriarSolicitacaoUseCase criarUseCase;
    private final ListarSolicitacoesUseCase listarUseCase;
    private final SolicitacaoRepository solicitacaoRepository;

    public SolicitacaoController(CriarSolicitacaoUseCase criarUseCase,
                                  ListarSolicitacoesUseCase listarUseCase,
                                  SolicitacaoRepository solicitacaoRepository) {
        this.criarUseCase = criarUseCase;
        this.listarUseCase = listarUseCase;
        this.solicitacaoRepository = solicitacaoRepository;
    }

    @Operation(summary = "Cria uma nova solicitação de coleta")
    @PostMapping
    public ResponseEntity<Solicitacao> criar(@Valid @RequestBody NovaSolicitacaoRequest req) {
        var solicitacao = criarUseCase.executar(req.email(), req.endereco());
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacao);
    }

    @Operation(summary = "Lista as solicitações do usuário autenticado")
    @GetMapping
    public ResponseEntity<List<Solicitacao>> listar() {
        return ResponseEntity.ok(listarUseCase.executar());
    }

    @Operation(summary = "Busca uma solicitação pelo ID")
    @GetMapping("/{id}")
    public ResponseEntity<Solicitacao> buscar(@PathVariable UUID id) {
        return solicitacaoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada"));
    }

    public record NovaSolicitacaoRequest(
            @Email @NotBlank String email,
            @NotBlank String endereco
    ) {}
}
