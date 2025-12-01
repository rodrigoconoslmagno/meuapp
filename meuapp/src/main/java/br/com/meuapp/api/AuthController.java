package br.com.meuapp.api;

import java.util.Map;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.meuapp.api.auth.AuthRequest;
import br.com.meuapp.api.auth.AuthResponse;
import br.com.meuapp.api.auth.RefreshToken;
import br.com.meuapp.config.CookieUtil;
import br.com.meuapp.config.JwtUtil;
import br.com.meuapp.entidades.Usuario;
import br.com.meuapp.persistence.GenericDao;
import br.com.meuapp.service.AuthService;
import br.com.meuapp.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final JwtUtil jwtUtil;
	private final AuthService authService;
	private final CookieUtil cookieUtil;
    private final RefreshTokenService refreshTokenService;
    private final GenericDao<Usuario, Integer> usuarioDao;

    public AuthController(JwtUtil jwtUtil, AuthService authService, CookieUtil cookieUtil, 
    		RefreshTokenService refreshTokenService, GenericDao<Usuario, Integer>  usuarioDao) {
        this.jwtUtil = jwtUtil;
        this.authService = authService;
        this.cookieUtil = cookieUtil;
        this.refreshTokenService = refreshTokenService;
        this.usuarioDao = usuarioDao;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req, HttpServletResponse reshttpResp) {
    	 // 🔍 Busca usuário com GenericSearch
         Usuario usuario = authService.autenticar(req.getLogin(), req.getPassword());

        if (usuario != null) {
            RefreshToken newRefreshTokenEntity = refreshTokenService.createAndSaveRefreshToken(usuario);
            String newRefreshTokenValue = newRefreshTokenEntity.getToken();
            cookieUtil.attachRefreshTokenCookie(reshttpResp, newRefreshTokenValue);
        	
            AuthResponse response =new AuthResponse(jwtUtil.generateToken(usuario.getLogin()), usuario.getNome());
            
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body("Usuário ou senha inválidos");
    }
    
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse httpResp) {
        String refreshTokenValue = cookieUtil.getRefreshTokenFromCookie(request);

        if (refreshTokenValue == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Refresh Token ausente."));
        }

        Optional<RefreshToken> tokenOpt = refreshTokenService.findByToken(refreshTokenValue);

        if (tokenOpt.isEmpty()) {
            // Se o token não está no DB ou expirou no DB, limpa o cookie
            cookieUtil.deleteRefreshTokenCookie(httpResp);
            return ResponseEntity.status(401).body(Map.of("message", "Refresh Token inválido ou expirado."));
        }

        refreshTokenValue = tokenOpt.get().getToken();
        jwtUtil.validateToken(refreshTokenValue);
        
        Usuario usuario = usuarioDao.buscarPorId(Usuario.class, tokenOpt.get().getUsuarioId());
        cookieUtil.deleteRefreshTokenCookie(httpResp);
        cookieUtil.attachRefreshTokenCookie(httpResp, refreshTokenValue); 

        AuthResponse response = new AuthResponse(refreshTokenValue, usuario.getNome());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshTokenValue = cookieUtil.getRefreshTokenFromCookie(request);
        
        if (refreshTokenValue != null) {
             // Revoga o token no banco de dados
            refreshTokenService.deleteToken(refreshTokenValue);
        }
        
        // Remove o Cookie
        cookieUtil.deleteRefreshTokenCookie(response);
        
        return ResponseEntity.ok(Map.of("message", "Logout realizado com sucesso."));
    }
    
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.getUsernameFromToken(token);
                return ResponseEntity.ok(Map.of("valid", true, "username", username));
            }
        }
        return ResponseEntity.status(401).body(Map.of("valid", false));
    }
}