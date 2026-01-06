import { useState, useEffect } from 'react';
import { ITemplateOption } from '@/types/ITemplateOption';
import serverBack from '@/api/server'; // **Ajuste o caminho conforme sua estrutura**
import { EnumTypes, EnumNameKey } from '@/types/EnumTypes'; 

/**
 * Hook customizado para buscar dados de Enums de forma centralizada e autenticada.
 * Utiliza serverBack.invoke para garantir o tratamento de Token/Refresh.
 * * @param enumName A chave do EnumTypes (ex: 'PARTICIPANTE_TIPO').
 */
export const useEnumOptions = (enumName: EnumNameKey) => {
    const [enumOptions, setEnumOptions] = useState<ITemplateOption[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!enumName) return;

        setLoading(true);
        const javaClassName = EnumTypes[enumName]; 
        
        serverBack.invoke<ITemplateOption[]>(
            'enumService',  
            'listValues', 
            javaClassName
        )
        .then(options => {
            setEnumOptions(options); 
        })
        .catch(error => {
            console.error(`❌ Erro ao carregar enum ${javaClassName} via invoke:`, error);
        })
        .finally(() => {
            setLoading(false);
        });

    }, [enumName]);

    return { options: enumOptions, loading };
};