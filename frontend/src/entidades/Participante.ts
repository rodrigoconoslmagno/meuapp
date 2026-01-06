import { BaseEntity } from "@/types/BaseEntity";

export class Participante extends BaseEntity {
    cnpjCpf: string | undefined = undefined;
    nome: string | undefined = undefined;
    nomeFantasia?: string;
    participanteTipo: number[] = [];
  }