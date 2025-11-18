package br.com.meuapp.framework;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * Inicializador do contexto Spring Boot quando o WAR
 * é implantado em um Tomcat externo.
 */
public class ServletInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        // 🔹 Define explicitamente o tipo como SERVLET e o contexto principal
        return application
                .sources(MeuAppApplication.class)
                .web(WebApplicationType.SERVLET);
    }

    /**
     * Método auxiliar opcional: permite rodar localmente (por linha de comando)
     * se quiser testar sem Tomcat externo.
     */
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MeuAppApplication.class);
        app.setWebApplicationType(WebApplicationType.SERVLET);
        app.run(args);
    }
}