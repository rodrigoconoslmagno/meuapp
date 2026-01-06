package br.com.meuapp.api;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.meuapp.api.generic.GenericRequest;
import br.com.meuapp.exception.UserException;

@RestController
@RequestMapping("/api/generic")
public class GenericController {

    private final ApplicationContext context;
    private final ObjectMapper objectMapper;

    public GenericController(ApplicationContext context, ObjectMapper objectMapper) {
        this.context = context;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<?> execute(@RequestBody GenericRequest request) {
        try {
            String serviceName = request.getService();
            Object serviceBean = context.getBean(serviceName);

            Method method = findMethod(serviceBean, request.getAction(), request.getPayload());
            if (method == null) {
                return ResponseEntity.badRequest().body("Ação não encontrada");
            }

            Object result;

            // 3️⃣ Converte o payload para o tipo do parâmetro
            if (method.getParameterCount() == 0) {
                // método sem parâmetros
                result = method.invoke(serviceBean);
            } else if (method.getParameterCount() == 1) {
                Class<?> paramType = method.getParameterTypes()[0];
                Object arg = objectMapper.convertValue(request.getPayload(), paramType);
                result = method.invoke(serviceBean, arg);
            } else {
                // Se tiver mais de um parâmetro, você pode adaptar aqui
                return ResponseEntity.badRequest().body("Método com mais de 1 parâmetro não suportado");
            }
            return ResponseEntity.ok(result);

        } catch (InvocationTargetException e) {
            Throwable target = e.getTargetException();
            if (target instanceof UserException) {
                throw (UserException) target; // deixa o ControllerAdvice tratar
            }
            throw new RuntimeException(target);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private Method findMethod(Object serviceBean, String action, Object payload) {
        // Aqui você pode refinar para encontrar o método certo com base no payload
        for (Method method : serviceBean.getClass().getMethods()) {
            if (method.getName().equals(action)) {
                return method;
            }
        }
        return null;
    }
}