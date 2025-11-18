package br.com.meuapp.framework;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.aspectj.EnableSpringConfigured;

@ComponentScan(basePackages = { "br.com.meuapp.framework", 
								"br.com.meuapp.config", 
								"br.com.meuapp.api",
								"br.com.meuapp.service",
								"br.com.meuapp.exception",
								"br.com.meuapp.persistence",   // ✅ necessário
							    "br.com.meuapp.filters",       // ✅ adicione esta linha
							    "br.com.meuapp.util"           // ✅ se JwtUtil não estiver em pacotes escaneados
							})
@SpringBootApplication
@EnableSpringConfigured
public class MeuAppApplication {
	public MeuAppApplication() {
        System.out.println("🚀 MeuAppApplication carregada!");
    }
}