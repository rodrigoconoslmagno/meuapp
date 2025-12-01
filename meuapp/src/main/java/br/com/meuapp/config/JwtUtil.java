package br.com.meuapp.config;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {

	// Carrega a chave secreta da variável de ambiente/propriedades
	@Value("${jwt.secret-key}")
    private String secretKeyString; // A string longa gerada por você
    
    private final long expiration = 1000 * 60 * 60; // 1hora
    private Key key;
    
    @PostConstruct // Inicializa a chave APENAS uma vez
    public void init() {
        // Cria a chave persistente a partir da string lida
        this.key = Keys.hmacShaKeyFor(secretKeyString.getBytes());
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(String username, Instant expiryDate) {
        Map<String, Object> claims = new HashMap<>();
        // Você pode adicionar um claim de "type" para diferenciar, se quiser
        claims.put("type", "refresh");
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // Define a expiração EXATAMENTE como a data calculada no RefreshTokenService
                .setExpiration(Date.from(expiryDate)) 
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject();
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
}