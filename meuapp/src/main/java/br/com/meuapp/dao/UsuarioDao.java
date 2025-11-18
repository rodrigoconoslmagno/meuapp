package br.com.meuapp.dao;

import br.com.meuapp.entidades.Usuario;
import br.com.meuapp.persistence.GenericDao;

public class UsuarioDao extends GenericDao<Usuario, Integer> {

	public UsuarioDao(Class<Usuario> entityClass) {
		super();
	}

}