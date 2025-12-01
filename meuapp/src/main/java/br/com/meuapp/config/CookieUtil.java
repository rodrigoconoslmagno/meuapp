package br.com.meuapp.config;

import org.springframework.stereotype.Component;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CookieUtil {

	private static final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

    public void attachRefreshTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, token);
        cookie.setHttpOnly(true); 
        // 🚨 Adicione 'cookie.setSecure(true);' em produção (apenas HTTPS)
        cookie.setMaxAge((int) (60 * 10)); // 1 dias
        cookie.setPath("/"); 
        response.addCookie(cookie);
    }

    public void deleteRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Força a remoção
        response.addCookie(cookie);
    }
    
    public String getRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }
        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals(REFRESH_TOKEN_COOKIE_NAME)) {
            	return cookie.getValue();
            }
        }
        return null;
    }
	
}