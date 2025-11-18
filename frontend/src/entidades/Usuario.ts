import { BaseEntity } from "@/types/BaseEntity";

export class Usuario extends BaseEntity {
    nome: string = "";
    login: string = "";
    senha: string = '';
    ativo: boolean = true;
  }