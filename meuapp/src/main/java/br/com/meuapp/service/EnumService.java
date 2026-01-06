package br.com.meuapp.service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import br.com.meuapp.persistence.BaseEnum;
import br.com.meuapp.persistence.EnumItemDTO;

@Service("enumService")
public class EnumService {

	private static final String ENUM_PACKAGE = "br.com.meuapp.entidades.";

    public List<EnumItemDTO> listValues(String enumName) {
        
		String sanitizedEnumName = enumName.trim().replace("\"", "");
        String fullClassName = ENUM_PACKAGE + sanitizedEnumName;

        try {
            Class<?> enumClass = Class.forName(fullClassName);

            if (!enumClass.isEnum() || !BaseEnum.class.isAssignableFrom(enumClass)) {
            	throw new IllegalArgumentException("A classe fornecida não é um Enum Base válido: " + enumName);
            }

            @SuppressWarnings("unchecked")
            Class<BaseEnum> castedEnumClass = (Class<BaseEnum>) enumClass;
            BaseEnum[] enumConstants = (BaseEnum[]) castedEnumClass.getEnumConstants();

            List<EnumItemDTO> response = Arrays.stream(enumConstants)
                    .map(e -> new EnumItemDTO(e.getDescricao(), e.getCodigo()))
                    .collect(Collectors.toList());

            return response;

        } catch (ClassNotFoundException e) {
        	throw new RuntimeException("Enum não encontrado: " + enumName, e);
        } catch (Exception e) {
            System.err.println("Erro ao processar enum: " + sanitizedEnumName + ". Erro: " + e.getMessage());
            throw new RuntimeException("Erro ao processar enum: " + enumName, e);
        }
    }
}
