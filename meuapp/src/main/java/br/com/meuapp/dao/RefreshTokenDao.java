package br.com.meuapp.dao;

import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import br.com.meuapp.api.auth.RefreshToken;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Repository
public class RefreshTokenDao {

    @PersistenceContext
    private EntityManager entityManager;
	
    @Transactional
    public RefreshToken save(RefreshToken refreshToken) {
        return entityManager.merge(refreshToken);
    }
    
    /**
     * 🚨 CORREÇÃO: Busca por campo não-ID usando JPQL.
     */
    public Optional<RefreshToken> findByToken(String token) {
        try {
            // JPQL: Seleciona o RefreshToken (rt) onde o campo 'token' na entidade é igual ao parâmetro :token
            String jpql = "SELECT rt FROM RefreshToken rt WHERE rt.token = :token";
            
            // Cria a query e define a classe de retorno (RefreshToken.class)
            TypedQuery<RefreshToken> query = entityManager.createQuery(jpql, RefreshToken.class)
                .setParameter("token", token); // Define o valor do parâmetro :token
                
            // getSingleResult() espera exatamente 1 resultado
            return Optional.of(query.getSingleResult()); 
            
        } catch (NoResultException e) {
            // Se nenhum resultado for encontrado, retorna Optional.empty()
            return Optional.empty();
        } catch (Exception e) {
             // Lidar com possíveis NonUniqueResultException, embora 'token' deva ser único.
            System.err.println("Erro ao buscar RefreshToken: " + e.getMessage());
            return Optional.empty(); 
        }
    }
    
    @Transactional
    public void deleteByToken(String token) {
        // É mais eficiente deletar por JPQL do que buscar e depois deletar:
        String jpql = "DELETE FROM RefreshToken rt WHERE rt.token = :token";
        entityManager.createQuery(jpql)
                     .setParameter("token", token)
                     .executeUpdate();
    }

    @Transactional
    public void deleteByUserId(Integer usuarioId) {
    	if (usuarioId == null) {
    		return;
    	}
        String jpql = "DELETE FROM RefreshToken rt WHERE rt.usuarioId = :usuarioId";
        entityManager.createQuery(jpql)
                     .setParameter("usuarioId", usuarioId)
                     .executeUpdate();
    }
}
