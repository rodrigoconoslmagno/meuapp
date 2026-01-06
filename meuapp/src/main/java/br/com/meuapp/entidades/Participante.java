package br.com.meuapp.entidades;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import br.com.meuapp.persistence.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "participante")
public class Participante extends BaseEntity<Integer> {

	private static final long serialVersionUID = -4513741558126586298L;

	@Column(length = 14)
	private String cnpjCpf;
	@Column(length = 60)
	private String nome;
	@Column(length = 60)
	private String nomeFantasia;
	@JsonIgnore
    @Column(name = "tipo", length = 50)
	private String tipo;
	@JsonIgnore 
    @Transient
    private List<ParticipanteTipo> participanteTipo;
	
	public String getCnpjCpf() {
		return cnpjCpf;
	}
	
	public void setCnpjCpf(String cnpjCpf) {
		this.cnpjCpf = cnpjCpf;
	}
	
	public String getNome() {
		return nome;
	}
	
	public void setNome(String nome) {
		this.nome = nome;
	}
	
	public String getNomeFantasia() {
		return nomeFantasia;
	}
	
	public void setRazaoSocial(String nomeFantasia) {
		this.nomeFantasia = nomeFantasia;
	}
	
	public void setTipoParticipante(List<ParticipanteTipo> participanteTipo) {
		this.participanteTipo = participanteTipo;
		
		this.tipo = convertListEnumToString(participanteTipo);
	}
	
	public List<ParticipanteTipo> getParticipanteTipo() {
        if ((this.participanteTipo == null || this.participanteTipo.isEmpty()) && this.tipo!= null) {
             this.participanteTipo = convertStringToListEnum(this.tipo, ParticipanteTipo.class);
        }
        return this.participanteTipo;
    }
	
}