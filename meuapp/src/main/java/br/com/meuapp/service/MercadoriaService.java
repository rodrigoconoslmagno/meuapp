package br.com.meuapp.service;

import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import br.com.meuapp.entidades.Mercadoria;
import br.com.meuapp.persistence.GenericDao;

@Service("mercadoriaService")
public class MercadoriaService {

    private final GenericDao<Mercadoria, Integer> genericDao;

    public MercadoriaService(GenericDao<Mercadoria, Integer> genericDao) {
        this.genericDao = genericDao;
    }
	
    // ======================================================
    // 🔹 LISTAR
    // ======================================================
    public List<Mercadoria> listar(Object payload) {
        // payload pode ser um Map<String, Object> com filtros opcionais
        return genericDao.listarTodos(Mercadoria.class);
    }

    // ======================================================
    // 🔹 SALVAR / ATUALIZAR
    // ======================================================
    public Mercadoria salvar(Mercadoria mercadoria) {
        genericDao.salvar(mercadoria);
        return mercadoria;
    }

    // ======================================================
    // 🔹 DELETAR
    // ======================================================
    public void deletar(Object payload) throws Exception {
        if (payload instanceof Map map && map.get("id") != null) {
            Integer id = ((Number) map.get("id")).intValue();
            Mercadoria usuario = genericDao.buscarPorId(Mercadoria.class, id);
            if (usuario != null) {
                genericDao.excluir(usuario);
            }
        }
    }
    
}
