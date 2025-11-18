package br.com.meuapp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FilterConfig implements WebMvcConfigurer {

    @Autowired
    private TransactionalRequestInterceptor transactionalRequestInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 🔹 Aplica o interceptor a todas as rotas /api/**
        registry.addInterceptor(transactionalRequestInterceptor)
                .addPathPatterns("/api/**");
    }
}