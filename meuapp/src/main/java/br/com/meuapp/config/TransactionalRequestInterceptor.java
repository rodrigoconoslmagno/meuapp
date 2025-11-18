package br.com.meuapp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

@Component
public class TransactionalRequestInterceptor implements HandlerInterceptor {

    @Autowired
    private JpaTransactionManager transactionManager; // ✅ Tipo exato

    private static final ThreadLocal<TransactionStatus> currentTransaction = new ThreadLocal<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());
        currentTransaction.set(status);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        TransactionStatus status = currentTransaction.get();
        if (status != null) {
            if (ex != null) {
                transactionManager.rollback(status);
            } else {
                transactionManager.commit(status);
            }
            currentTransaction.remove();
        }
    }
}
