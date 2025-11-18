package br.com.meuapp.exception;

public class UserException extends RuntimeException {
    private static final long serialVersionUID = 3277697982241779333L;

	public UserException(String message) {
        super(message);
    }
}