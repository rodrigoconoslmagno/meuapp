package br.com.meuapp.entidades;

import jakarta.persistence.*;
import br.com.meuapp.exception.UserException;
import br.com.meuapp.persistence.BaseEntity; 

@Entity
@Table(name = "usuario")
public class Usuario extends BaseEntity<Integer> {

	private static final long serialVersionUID = -4702618693854486689L;
	
	@Column(nullable = false, length = 100)
	private String nome;
	@Column(unique = true, nullable = false)
	private String login;
	private boolean ativo;	
	private String senha;
	
	@PreRemove
	private void bloqueiaExclusaoAdmin() {
		// Se o ID for 1, lançamos uma exceção
        if (id != null && id.equals(1)) {
            // Lançar uma exceção de Runtime específica
        	throw new UserException("Não é possível ecluir o usuário com o ID 1, apenas alterar os dados");
        }
	}
	
	public String getNome() {
		return nome;
	}
	
	public void setNome(String nome) {
		this.nome = nome;
	}
	
	public String getLogin() {
		return login;
	}
	
	public void setLogin(String login) {
		this.login = login;
	}
	
	public boolean isAtivo() {
		return ativo;
	}
	
	public void setAtivo(boolean ativo) {
		this.ativo = ativo;
	}
	
	public String getSenha() {
		return senha;
	}
	
	public void setSenha(String senha) {
		this.senha = senha;
	}
}