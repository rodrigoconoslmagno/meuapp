package br.com.meuapp.api.generic;

public class GenericRequest {
    private String service;   // ex: "usuario", "cliente", "mercadoria"
    private String action;    // ex: "listar", "salvar", "deletar"
    private Object payload;   // dados da operação
    // getters e setters
    
    public String getService() {
		return service;
	}
    
    public String getAction() {
		return action;
	}
    
    public Object getPayload() {
		return payload;
	}
}