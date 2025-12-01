import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import serverBack from "@/api/server";
import { UIHelper } from "@/utils/UIHelper";
import { useNavigate } from "react-router-dom";
import Session from '@/utils/session';
import { useAuth } from "@/context/AuthContext";
import session from "@/utils/session"

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
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw', 
          background: 'linear-gradient(135deg, #1e88e5, #6a1b9a)',
          margin: 0,
          padding: 0,
        }}
      >
        <Card
          title="Acesse sua conta"
          className="shadow-6 p-4"
          style={{
            width: '400px',
            maxWidth: '90%',
            borderRadius: '1.5rem',
            background: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <div className="p-fluid">
              <div className="field">
                <label htmlFor="login">Usuário</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-user" />
                  <InputText
                    id="login"
                    className={erroLogin ? "p-invalid" : ""}  
                    value={login}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="Digite seu usuário"
                    autoComplete="username"
                    required
                  />
                </span>
              </div>

              <div className="field mt-3">
                <label htmlFor="senha" >Senha</label>
                <Password
                  inputId="senha"
                  className={erroSenha ? "p-invalid" : ""}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  feedback={false}
                  toggleMask
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="button"
                label="Entrar"
                icon="pi pi-sign-in"
                className="mt-4 p-button-rounded p-button-primary w-full"
                onClick={handleLogin}
              />
            </div>
        </Card>
      </div>
    );
  }