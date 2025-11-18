package br.com.meuapp.persistence;

import java.io.Serializable;
import java.util.List;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaQuery;

/**
 * DAO genérico baseado em Hibernate, integrado ao contexto Spring Boot.
 * 
 * @param <T>  Tipo da entidade (ex: Usuario)
 * @param <ID> Tipo do identificador (ex: Long, UUID, etc.)
 */
@Repository
@Transactional
public class GenericDao<T extends BaseEntity<ID>, ID extends Serializable> {

    @PersistenceContext
    private EntityManager entityManager;

    protected Session getSession() {
        return entityManager.unwrap(Session.class);
    }

    public void salvar(T entity) {
        if (entity.getId() == null) {
            entityManager.persist(entity);
        } else {
            entityManager.merge(entity);
        }
    }

    public T buscarPorId(Class<T> entityClass, ID id) {
        return entityManager.find(entityClass, id);
    }

    public void excluir(T entity) {
        entityManager.remove(entityManager.contains(entity) ? entity : entityManager.merge(entity));
    }

    public List<T> listarTodos(Class<T> entityClass) {
        CriteriaQuery<T> cq = entityManager.getCriteriaBuilder().createQuery(entityClass);
        cq.select(cq.from(entityClass));
        List<T> resultados = entityManager.createQuery(cq).getResultList();

        // Desanexa todas as entidades, evitando flush automático
        resultados.forEach(entityManager::detach);

        return resultados;
    }
}
