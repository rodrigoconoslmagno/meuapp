package br.com.meuapp.config;

import java.io.File;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.ServletContextAware;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.ServletContext;

@Configuration
public class ExternalConfigLoader implements ServletContextAware {

	 private ServletContext servletContext;
	
	@Override
	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}

	@PostConstruct
    public void loadExternalProperties() {
        try {
            String context = servletContext.getContextPath().replace("/", "");
            if (context.isEmpty()) {
            	return;
            }

            String path =  "/config/application.properties";
            File file = new File(path);

            if (file.exists()) {
                System.setProperty("spring.config.additional-location", "file:" + path);
                System.out.println("✅ Configuração externa carregada de: " + path);
            } else {
                System.out.println("⚠️ Configuração externa não encontrada em " + path + ", usando defaults internos.");
            }

        } catch (Exception e) {
            System.err.println("Erro ao carregar configuração externa: " + e.getMessage());
        }
    }
}