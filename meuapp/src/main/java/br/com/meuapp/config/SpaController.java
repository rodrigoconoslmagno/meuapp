package br.com.meuapp.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("${server.servlet.context-path:}")
public class SpaController {

    /**
     * Fallback SPA — compatível com Spring Boot 3 / PathPatternParser
     * Redireciona apenas rotas React que não sejam APIs ou assets.
     */
    @GetMapping(value = {"/",
    	"/{path:^(?!api|auth|assets|static|WEB-INF|META-INF|index\\.html|vite\\.svg|error).*}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}