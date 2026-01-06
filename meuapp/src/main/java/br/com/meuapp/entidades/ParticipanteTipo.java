package br.com.meuapp.entidades;

import br.com.meuapp.persistence.BaseEnum;

public enum ParticipanteTipo implements BaseEnum {
	
	EMPRESA_LOJA(1, "Empresa / Loja"),
	CLIENTE(2, "Cliente"),
	FORNECEDOR(3, "Fornecedor");

	private int codigo;
	private String descricao;
	
	private ParticipanteTipo(int codigo, String descricao) {
		this.codigo = codigo;
		this.descricao = descricao;
	}
	
	@Override
	public int getCodigo() {
		return codigo;
	}
	
	@Override
	public String getDescricao() {
		return descricao;
	}

	public static ParticipanteTipo fromCodigo(int codigo) {
		for(ParticipanteTipo item : values()) {
			if (codigo == item.getCodigo()) {
				return item;
			}
		}
		return null;
	}
}
