package br.com.meuapp.entidades;

import br.com.meuapp.persistence.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "mercadoria")
public class Mercadoria extends BaseEntity<Integer> {

	private static final long serialVersionUID = 1446593160609868553L;
	
	@Column(nullable = false, length = 120)
	private String descrixao;
	
	public String getDescrixao() {
		return descrixao;
	}
	
	public void setDescrixao(String descrixao) {
		this.descrixao = descrixao;
	}	
}
