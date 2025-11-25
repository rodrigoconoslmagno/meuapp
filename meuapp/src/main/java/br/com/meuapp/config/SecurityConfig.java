package br.com.meuapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

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
	        	        "/error", "/WEB-INF/**"
	        	    ).permitAll()
	        	    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
	        	    .anyRequest().authenticated()
	        )
	        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
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
}