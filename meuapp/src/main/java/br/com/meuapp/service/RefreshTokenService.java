package br.com.meuapp.service;

import java.time.Instant;
import java.util.Optional;
import org.springframework.stereotype.Service;
import br.com.meuapp.api.auth.RefreshToken;
import br.com.meuapp.config.JwtUtil;
import br.com.meuapp.dao.RefreshTokenDao;
import br.com.meuapp.entidades.Usuario;
import jakarta.transaction.Transactional;

@Service
public class RefreshTokenService {

	private final RefreshTokenDao refreshTokenDao; 
    private final JwtUtil jwtUtil;
    
   private static final long REFRESH_TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7 dias

    public RefreshTokenService(RefreshTokenDao refreshTokenDao, JwtUtil jwtUtil) {
        this.refreshTokenDao = refreshTokenDao;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public RefreshToken createAndSaveRefreshToken(Usuario usuario) {
        
        // Revoga/deleta qualquer token anterior para este usuário
        refreshTokenDao.deleteByUserId(usuario.getId()); 
        
        Instant expiryDate = Instant.now().plusSeconds(REFRESH_TOKEN_EXPIRATION_SECONDS);
        
        // ⚠️ ATENÇÃO: Seu JwtUtil deve ter um método para gerar o Refresh Token com esta expiração
        String tokenValue = jwtUtil.generateRefreshToken(usuario.getNome(), expiryDate); 
        
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(tokenValue);
        refreshToken.setUsuarioId(usuario.getId());
        refreshToken.setDataExpiracao(expiryDate);
        return refreshTokenDao.save(refreshToken);
    }
    
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenDao.findByToken(token)
                .filter(rt -> !rt.isExpirado()) 
                // Verifica também a expiração da data salva no banco
                .filter(rt -> rt.getDataExpiracao().isAfter(Instant.now())); 
    }

    @Transactional
    public void deleteToken(String token) {
        refreshTokenDao.deleteByToken(token);
    }
	
}
