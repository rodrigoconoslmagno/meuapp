package br.com.meuapp.service;

import br.com.meuapp.entidades.Usuario;
import br.com.meuapp.exception.UserException;
import br.com.meuapp.persistence.GenericDao;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service("usuarioService") // nome do bean para casar com o front
public class UsuarioService {
    private final GenericDao<Usuario, Integer> genericDao;

    public UsuarioService(GenericDao<Usuario, Integer> genericDao) {
        this.genericDao = genericDao;
    }

    // ======================================================
    // 🔹 LISTAR
    // ======================================================
    public List<Usuario> listar(Object payload) {
        // payload pode ser um Map<String, Object> com filtros opcionais
        return genericDao.listarTodos(Usuario.class).stream().map(usr -> {
        		usr.setSenha(null);
        		return usr;
        	}).collect(Collectors.toList());
    }

    // ======================================================
    // 🔹 SALVAR / ATUALIZAR
    // ======================================================
    public Usuario salvar(Usuario usuario) {
    	Integer id = usuario.getId();
    	if (id != null && (usuario.getSenha() == null || usuario.getSenha().isEmpty())) {
    		Usuario senha = genericDao.buscarPorId(Usuario.class, id);
    		usuario.setSenha(senha.getSenha());
    	} else {
            if (!usuario.getSenha().startsWith("$2a$")) {
                usuario.setSenha(BCrypt.hashpw(usuario.getSenha(), BCrypt.gensalt()));
            }
    	}
        genericDao.salvar(usuario);
        return usuario;
    }

    // ======================================================
    // 🔹 DELETAR
    // ======================================================
    public void deletar(Object payload) throws Exception {
        if (payload instanceof Map map && map.get("id") != null) {
            Integer id = ((Number) map.get("id")).intValue();
            
            if (id.equals(1)) {
            	throw new UserException("Não é possível ecluir o usuário com o ID 1, apenas alterar os dados");
            }
            
            Usuario usuario = genericDao.buscarPorId(Usuario.class, id);
            if (usuario != null) {
                genericDao.excluir(usuario);
            }
        }
    }
}
