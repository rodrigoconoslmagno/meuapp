package br.com.meuapp.persistence;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@MappedSuperclass
public abstract class BaseEntity<ID extends Serializable> implements Serializable {

    private static final long serialVersionUID = 4036764450552918032L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, nullable = false)
	protected ID id;
    
    @Column(name = "datacriacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;
    
    @Column(name = "dataatualizacao")
    private LocalDateTime dataAtualizacao;

    @PrePersist
    protected void onCreate() {
        this.dataCriacao = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.dataAtualizacao = LocalDateTime.now();
    }
    
    public ID getId() {
		return id;
	}
    
    public void setId(ID id) {
		this.id = id;
	}
	
    public LocalDateTime getDataCriacao() {
		return dataCriacao;
	}
    
    public LocalDateTime getDataAtualizacao() {
		return dataAtualizacao;
	}
}