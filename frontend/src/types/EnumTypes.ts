/**
 * Mapeia o nome lógico do Enum (usado no componente) para 
 * o nome da classe Java (usado na URL do Backend).
 */
export const EnumTypes = {
    PARTICIPANTE_TIPO: 'ParticipanteTipo'
} as const; // 'as const' garante que os valores são strings literais

export type EnumNameKey = keyof typeof EnumTypes;