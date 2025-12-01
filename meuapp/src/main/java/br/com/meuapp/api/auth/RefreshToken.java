package br.com.meuapp.api.auth;


import java.time.Instant;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "refreshtoken")
public class RefreshToken {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private int id;
	
	@Column(unique = true, nullable = false)
	private String token; // O JWT Refresh Token
	@Column(unique = true, nullable = false)
    private Integer usuarioId; // ID do usuário associado
    private Instant dataExpiracao; // Data de expiração longa
    private boolean expirado;
	
    public int getId() {
		return id;
	}
    
    public void setId(int id) {
		this.id = id;
	}
    
    public String getToken() {
		return token;
	}
    
    public void setToken(String token) {
		this.token = token;
	}
    
    public void setUsuarioId(Integer usuarioId) {
		this.usuarioId = usuarioId;
	}
    
    public Integer getUsuarioId() {
		return usuarioId;
	}
    
    public Instant getDataExpiracao() {
		return dataExpiracao;
	}
    
    public void setDataExpiracao(Instant dataExpiracao) {
		this.dataExpiracao = dataExpiracao;
	}
	
    public boolean isExpirado() {
		return expirado;
	}
    
    public void setExpirado(boolean expirado) {
		this.expirado = expirado;
	}
}