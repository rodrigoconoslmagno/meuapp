import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import serverBack from "@/api/server";
import { UIHelper } from "@/utils/UIHelper";
import { useNavigate } from "react-router-dom";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import Session from '@/utils/session';
import { useAuth } from "@/context/AuthContext";
import session from "@/utils/session"
import './Login.css'

export default function Login() {
    const [login, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [erroLogin, setErroLogin] = useState(false);
    const [erroSenha, setErroSenha] = useState(false);
    const navigate = useNavigate();
    const { login: authLogin } = useAuth(); 

    useEffect(() => {
      const storedError = session.getMsgError();

      if (storedError) {
          UIHelper.error(storedError)

          session.removerMsgError();
      }
    }, []);

    const handleLogin = async (e?: React.FormEvent) => {
      e?.preventDefault(); 
    
      setErroLogin(false);
      setErroSenha(false);
    
      let erro = false;
    
      if (!login.trim()) {
        setErroLogin(true);
        erro = true;
      }
    
      if (!senha.trim()) {
        setErroSenha(true);
        erro = true;
      }
    
      if (erro) {
        UIHelper.error("Preencha todos os campos obrigatórios.");
        return;
      }

      try {
        const { token, userName }  = await serverBack.login(login, senha);
        Session.saveUser(userName);
        authLogin(token);
        UIHelper.success(`Bem-vindo, ${userName || "usuário"}!`);
        navigate('/', { replace: true });
      } catch (error: any) {
        console.error("❌ Erro de login:", error);
        UIHelper.error("Usuário ou senha incorretos.");
      }
    };
  
    return (
      <div
        className="login-wrapper"
      >
        <Card
          title="Acesse sua conta"
          className="login-card shadow-4"
        >
          <div className="p-fluid">
              <div className="field mb-4">
                <label htmlFor="login" className="block mb-2 font-bold">
                  Usuário
                </label>
                <IconField iconPosition="left">
                  <InputIcon className="pi pi-user" />
                  <InputText
                    id="login"
                    className={erroLogin ? "p-invalid" : ""}  
                    value={login}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="Digite seu usuário"
                    autoComplete="username"
                    required
                  />
                  </IconField>
              </div>

              <div className="field mb-4">
                <label htmlFor="senha" className="block mb-2 font-bold">
                  Senha
                </label>
                <Password
                  inputId="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  feedback={false}
                  toggleMask
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  className={erroSenha ? "p-invalid" : ""}
                />
              </div>

              <Button
                type="button"
                label="Entrar"
                icon="pi pi-sign-in"
                className="p-button-raised"
                onClick={handleLogin}
              />
            </div>
        </Card>
      </div>
    );
  }