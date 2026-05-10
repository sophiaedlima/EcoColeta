package com.ecocoleta.worker.domain;

import java.util.UUID;

public record StatusAtualizadoEvent(UUID solicitacaoId, String novoStatus) {}
