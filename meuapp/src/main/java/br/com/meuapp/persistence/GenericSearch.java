package br.com.meuapp.persistence;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

/**
 * Classe genérica para consultas dinâmicas com filtros.
 * Compatível com o contexto Spring Boot (sem HibernateUtil).
 */
@Repository
@Transactional(readOnly = true)
public class GenericSearch {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Busca uma lista de entidades com base nos filtros informados.
     * 
     * @param filters Map com nome do campo e valor
     * @return Lista de entidades que atendem aos filtros
     */
    public <E> List<E> findByFilters(Class<E> entityClass, Map<String, Object> filters) {
        StringBuilder hql = new StringBuilder("FROM " + entityClass.getSimpleName() + " e WHERE 1=1");

        for (String key : filters.keySet()) {
            hql.append(" AND e.").append(key).append(" = :").append(key);
        }

        TypedQuery<E> query = entityManager.createQuery(hql.toString(), entityClass);

        filters.forEach(query::setParameter);

        return query.getResultList();
    }

    /**
     * Busca apenas um registro (o primeiro) pelos filtros informados.
     * 
     * @param filters Map com nome do campo e valor
     * @return Entidade encontrada ou null
     */
    public <T> T findUniqueByFilters(Class<T> entityClass, Map<String, Object> filters) {
        List<T> results = findByFilters(entityClass, filters);
        return results.isEmpty() ? null : results.get(0);
    }
}
