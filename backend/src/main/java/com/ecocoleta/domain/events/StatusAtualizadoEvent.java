package com.ecocoleta.domain.events;

import com.ecocoleta.domain.StatusColeta;
import java.util.UUID;

public record StatusAtualizadoEvent(UUID solicitacaoId, StatusColeta novoStatus) {}
