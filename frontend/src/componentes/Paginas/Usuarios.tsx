import { Crud } from "@/componentes/Crud/Crud";
import { EditText } from "@/componentes/Inputs/EditText";
import { Usuario } from "@/entidades/Usuario";
import { LabelText } from "../label/LabelText";
import { Formatter } from "@/utils/Formatter";
import { EditCheckBox } from "../checkbox/EditCheckBox";
import { useEffect, useMemo, useRef, useState } from "react";
import { UIHelper } from "@/utils/UIHelper";
import { FormGroup } from "@/componentes/Crud/FormGroup"

interface FiltroUsuario {
  nome?: string;
  login?: string;
}

export default function Usuarios() {
  const [senha, setSenha] = useState<string | undefined>(undefined);
  const [confirmarSenha, setConfirmarSenha] = useState<string | undefined>(undefined);
  const [erroSenha, setErroSenha] = useState("");
  const [erroConfirmar, setErroConfirmar] = useState("");
  const senhaRefComp = useRef<HTMLInputElement>(null);
  const confirmarRefComp = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<string | undefined>();
  const confirmarRef = useRef<string | undefined>();

  const validarSenhas = (s1: string | undefined, s2: string | undefined) => {
    if (s1 || s2) {
      if (!s1) {
        setErroSenha("Informe a senha.");
        senhaRefComp.current?.focus();
      } else if (!s2) {
        setErroConfirmar("Confirme a senha.");
        confirmarRefComp.current?.focus();
      } else if (s1 !== s2) {
        setErroSenha(" ");
        setErroConfirmar("As senhas não coincidem.");
        confirmarRefComp.current?.focus();
      } else {
        setErroSenha("");
        setErroConfirmar("");
      }
    } else {
      setErroSenha("");
      setErroConfirmar("");
    }
  };

    const beforeSave = (data: Usuario) => {
      const senhaAtual = senhaRef.current;
      const confirmarAtual = confirmarRef.current;
      const isNovo = !data.id;
  
      if (isNovo && (!senhaAtual || !confirmarAtual)) {
        UIHelper.error("Informe e confirme a senha para cadastrar o usuário.");
        throw new Error("Senha obrigatória no novo cadastro");
      }
  
      if ((senhaAtual && !confirmarAtual) || (!senhaAtual && confirmarAtual)) {
        UIHelper.error("Ambos os campos de senha devem ser preenchidos.");
        throw new Error("Campos de senha incompletos");
      }

      if (senhaAtual && confirmarAtual && senhaAtual !== confirmarAtual) {
        UIHelper.error("As senhas não coincidem.");
        throw new Error("Senhas diferentes");
      }
  
      if (!senhaAtual) {
        const { senha: _, ...rest } = data;
        return rest as Usuario;
      }

      return { ...data, senhaAtual };
    };

   const afterNew = () => {
    setSenha(undefined);
    setConfirmarSenha(undefined);
    setErroSenha("");
    setErroConfirmar("");
  };   

  useEffect(() => {
    senhaRef.current = senha;
    confirmarRef.current = confirmarSenha;
    validarSenhas(senha, confirmarSenha);
  }, [senha, confirmarSenha]);

  const acoesExtras = useMemo(() => [
    {
      label: "Exportar",
      icon: "pi pi-download",
      onClick: () => console.log("Exportar usuários"),
      className: "p-button-secondary",
    },
  ], []); 

  return (
    <Crud<Usuario, FiltroUsuario>
      pageTitle="Usuário"
      serviceName="usuarioService"
      entityType={Usuario}
      extraActions={acoesExtras}
      columns={[
        { field: "nome", header: "Nome" },
        { field: "login", header: "Login" },
        { field: "ativo", header: "Situação", body: (row) => (row.ativo ? "✅ Ativo" : "❌ Inativo")}
      ]}
      emptyModel={{ nome: "", login: "", senha: "", ativo: true}}
      emptyFilter={{ nome: "", login: "" }}
      itemIdField="id"
      afterNew={afterNew}
      beforeSave={beforeSave}
      renderForm={(user, onChange) => (
        <>
          <FormGroup title="Dados Principais">
            <LabelText id="dtCriacao" label="Data Criação" value={Formatter.formatarDataHora(user.dataCriacao)} col="6" />
            <LabelText id="dtArualizacao" label="Data Alteração" value={Formatter.formatarDataHora(user.dataAtualizacao)} col="6" />
            <EditText id="name" label="Nome" value={user.nome} onChange={(v) => onChange("nome", v)} col="6" required />
            <EditText id="login" label="Login" value={user.login} onChange={(v) => onChange("login", v)} col="6" required/>

            <EditText id="senha" 
                      label="Senha" 
                      value={senha} 
                      onChange={(v) => {
                          setSenha(v);
                          onChange("senha", v); 
                        } 
                      }
                      col="6" 
                      required={!!senha || !!confirmarSenha}
                      errorMessage={erroSenha}
                      type="password"/>

            <EditText id="confirmasenha" 
                      label="Repetir senha" 
                      value={confirmarSenha} 
                      onChange={(v) => {
                          setConfirmarSenha(v);
                        }
                      } 
                      col="6" 
                      required={!!senha || !!confirmarSenha}
                      errorMessage={erroConfirmar}
                      type="password"/>

            <EditCheckBox id="chkAtivo" label="Ativo" checked={user.ativo} onChange={(v) => onChange("ativo", v)} col="6" />
          </FormGroup>
        </>
      )}
      renderFilter={(filter, onChange) => (
        <>
          <EditText id="name" label="Nome" value={filter.nome || ""} onChange={(v) => onChange("nome", v)} col="6" />
          <EditText id="email" label="E-mail" value={filter.login || ""} onChange={(v) => onChange("login", v)} col="6" />
        </>
      )}
    />
    
  );
}