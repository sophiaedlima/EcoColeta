package com.ecocoleta.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.ecocoleta.domain.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtService {

    @Value("${ecocoleta.jwt.secret}")
    private String secret;

    @Value("${ecocoleta.jwt.expiration-ms}")
    private long expirationMs;

    public String gerar(Usuario usuario) {
        return JWT.create()
                .withSubject(usuario.getEmail())
                .withClaim("role", usuario.getRole().name())
                .withExpiresAt(Instant.now().plusMillis(expirationMs))
                .sign(Algorithm.HMAC256(secret));
    }

    public String extrairEmail(String token) {
        return JWT.require(Algorithm.HMAC256(secret))
                .build()
                .verify(token)
                .getSubject();
    }

    public boolean validar(String token) {
        try {
            JWT.require(Algorithm.HMAC256(secret)).build().verify(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
