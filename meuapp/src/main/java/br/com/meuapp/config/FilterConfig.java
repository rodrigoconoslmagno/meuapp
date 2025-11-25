package br.com.meuapp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FilterConfig implements WebMvcConfigurer {

    @Autowired
    private TransactionalRequestInterceptor transactionalRequestInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(transactionalRequestInterceptor)
                .addPathPatterns("/api/**");
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
    	 // Garante que o Spring sirva os arquivos do webapp diretamente
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/META-INF/resources/",
                                       "classpath:/resources/",
                                       "classpath:/static/",
                                       "classpath:/public/",
                                       "/")
                .resourceChain(true);
    }
}