package com.ecocoleta.adapters;

import com.ecocoleta.config.JwtService;
import com.ecocoleta.domain.Usuario;
import com.ecocoleta.infrastructure.persistence.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Operation(summary = "Autentica o usuário e retorna o token JWT")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        var usuario = usuarioRepository.findByEmail(req.email())
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        if (!passwordEncoder.matches(req.senha(), usuario.getSenhaHash())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }

        String token = jwtService.gerar(usuario);
        return ResponseEntity.ok(new LoginResponse(token, usuario.getEmail(), usuario.getRole().name()));
    }

    @Operation(summary = "Registra um novo usuário")
    @PostMapping("/registro")
    public ResponseEntity<Void> registro(@Valid @RequestBody RegistroRequest req) {
        if (usuarioRepository.findByEmail(req.email()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        var usuario = new Usuario();
        usuario.setEmail(req.email());
        usuario.setSenhaHash(passwordEncoder.encode(req.senha()));
        usuarioRepository.save(usuario);
        return ResponseEntity.status(201).build();
    }

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String senha
    ) {}

    public record RegistroRequest(
            @Email @NotBlank String email,
            @NotBlank String senha
    ) {}

    public record LoginResponse(String token, String email, String role) {}
}
