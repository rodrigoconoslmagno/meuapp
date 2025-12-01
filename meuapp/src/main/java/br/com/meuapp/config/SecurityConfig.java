package br.com.meuapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
	        .csrf(csrf -> csrf.disable())
	        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
	        .authorizeHttpRequests(auth -> auth
	        	    .requestMatchers(
	        	        "/", "/index.html", "/favicon.ico",
	        	        "/assets/**", "/static/**", "/vite.svg",
	        	        "/manifest.json", "/api/auth/**",
	        	        "/error", "/WEB-INF/**", "/login"
	        	    ).permitAll()
	        	    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
	        	    .requestMatchers(HttpMethod.GET, "/**").permitAll()
	        	    .anyRequest().authenticated()
	        )
	        .exceptionHandling(e -> e.authenticationEntryPoint(unauthorizedHandler()))
	        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }

 // NOVO: Cria o manipulador de erro 401
    private AuthenticationEntryPoint unauthorizedHandler() {
        return (request, response, authException) -> {
            // Garante que o Spring Security retorne 401 para todas as requisições não autenticadas
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        };
    }
    
    /**
     * CORS programático sem application.properties
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
    
    /**
     * 🚫 Este WebMvcConfigurer desativa qualquer configuração global automática
     * que ainda possa estar setando allowedOrigins("*") com allowCredentials(true).
     */
    @Bean
    public WebMvcConfigurer disableDefaultCors() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Reforça a mesma configuração do Security, evitando conflito
                registry.addMapping("/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("Authorization", "Content-Type", "Accept")
                        .allowCredentials(true);
            }
        };
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        // Aumente a força de 10 (padrão) para 12. 
        // Teste 13 ou 14 se o tempo de login for aceitável (abaixo de 1 segundo).
        return new BCryptPasswordEncoder(12); 
    }
}