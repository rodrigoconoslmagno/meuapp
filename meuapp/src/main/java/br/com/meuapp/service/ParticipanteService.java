package br.com.meuapp.service;

import java.util.List;
import org.springframework.stereotype.Service;
import br.com.meuapp.entidades.Participante;
import br.com.meuapp.persistence.GenericDao;

@Service("participanteService")
public class ParticipanteService {

    private final GenericDao<Participante, Integer> genericDao;
	
    public ParticipanteService(GenericDao<Participante, Integer> genericDao) {
        this.genericDao = genericDao;
    }
    
    public List<Participante> listar(Object payload) {
        // payload pode ser um Map<String, Object> com filtros opcionais
        return genericDao.listarTodos(Participante.class);
    }
	
}
