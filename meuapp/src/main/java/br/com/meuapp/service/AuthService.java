package br.com.meuapp.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.com.meuapp.entidades.Usuario;
import br.com.meuapp.persistence.GenericSearch;

@Service
public class AuthService {

	@Autowired(required = false)
    private GenericSearch search;
    
    public Usuario autenticar(String login, String senha) {
        // 🔹 1. Busca o usuário pelo login
        Map<String, Object> filtros = new HashMap<>();
        filtros.put("login", login);

        List<Usuario> usuarios = search.findByFilters(Usuario.class, filtros);
        if (usuarios.isEmpty()) {
            return null;
        }

        Usuario usuario = usuarios.get(0);
        
        // 🔹 2. Valida senha com BCrypt
        if (usuario == null || (usuario.isAtivo() && !BCrypt.checkpw(senha, usuario.getSenha()))) {
        	return null;
        }
        
        // 🔹 3. Gera token JWT
        return usuario;
    }
}
