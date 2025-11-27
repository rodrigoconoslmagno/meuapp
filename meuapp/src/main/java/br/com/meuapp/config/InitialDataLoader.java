package br.com.meuapp.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import br.com.meuapp.entidades.Usuario;
import br.com.meuapp.service.UsuarioService;

@Component
public class InitialDataLoader implements CommandLineRunner {
	
	private final UsuarioService usuarioService;
	
	public InitialDataLoader(UsuarioService usuarioService) {
		this.usuarioService = usuarioService;
	}

	@Override
	public void run(String... args) throws Exception {
	
		Usuario admin = usuarioService.buscaPorId(1);
		if (admin == null) {
			admin = new Usuario();
			admin.setId(1);
			admin.setAtivo(true);
			admin.setNome("Administrador");
			admin.setLogin("admin");
			admin.setSenha("meuapp");
			usuarioService.salvar(admin);
		}
	}

}