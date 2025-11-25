// src/services/server.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";

type HttpMethod = "GET" | "POST";

class ServerClient {
  private client: AxiosInstance;
  private readonly TOKEN_KEY = "token";

  constructor() {
    // Detecta dinamicamente o contexto base (ex: /meuapp) e se está em ambiente de dev (Vite)
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const contextPath = pathParts.length > 0 && !pathParts[0].includes(".")
      ? `/${pathParts[0]}`
      : "";

    // Se estiver rodando no Vite (porta 5173), aponta para o Tomcat (porta 8080)
    const isLocalDev = window.location.port === "5173";
    const baseURL = isLocalDev
      ? `http://localhost:8080${contextPath}/api`
      : `${window.location.origin}${contextPath}/api`;

    console.log("🌐 Server Base URL:", baseURL);

    this.client = axios.create({
      baseURL,
      timeout: 15_000,
      headers: { "Content-Type": "application/json" },
    });

    // ✅ Intercepta TODAS as requisições e insere o token JWT
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });

    // ✅ Intercepta respostas e trata erros globais
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url || "";

        console.log("🔎 Interceptor status:", status, "URL:", requestUrl);

        // ⚠️ só redireciona se NÃO for o endpoint de login
        if (status === 401 && !requestUrl.includes("/auth/login")) {
          console.warn("Sessão expirada ou não autorizada.");
          this.logout(); // logout faz o redirect
        } else if (status === 403) {
          console.error("Acesso negado.");
        } else if (status >= 500) {
          console.error("Erro interno no servidor.");
        }

        // ❌ retorna o erro pro front tratar com toast, sem recarregar
        return Promise.reject(error);
      }
    );
  }

  // ======================================================
  // 🔐 AUTENTICAÇÃO
  // ======================================================

  async login(login: string, password: string): Promise<{ token: string; userName: string }> {
    console.log("pasasndo pelo login", localStorage)
    try {
      if (localStorage.getItem(this.TOKEN_KEY)) {
        localStorage.removeItem(this.TOKEN_KEY);
      }
      const response = await this.client.post<{ token: string, userName: string }>("/auth/login", {
        login,
        password,
      });
      const { token, userName } = response.data;
      if (token) {
        localStorage.setItem(this.TOKEN_KEY, token);
      }
      return { token, userName };
    } catch (error: any) {
      console.error("❌ Erro no login:", error);
      throw error;
    }
  }

  logout() {
    this.clearToken();
    // redireciona dinamicamente para o contexto atual
    const pathParts = window.location.pathname.split("/");
    const contextPath = pathParts.length > 1 && pathParts[1] ? `/${pathParts[1]}` : "";
    window.location.href = `${window.location.origin}${contextPath}/`;
  }

  private clearToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // ======================================================
  // ⚙️ EXECUÇÃO GENÉRICA DE SERVICES BACKEND
  // ======================================================

  async invoke<T = any>(
    service: string,
    action: string = "list",
    payload?: any
  ): Promise<T> {
    console.log("invoke", service, action, payload)
    try {
      const response = await this.client.post<T>("/generic", {
        service,
        action,
        payload,
      });

      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao chamar ${service}.${action}:`, error);
      if (error.response) {
        const status = error.response.status;
        const msg = error.response.data?.message || "Erro inesperado no servidor.";
  
        if (status === 400) {
          // Erro de negócio
          throw new Error(msg);
        } else if (status === 401) {
          this.logout();
          throw new Error("Sessão expirada. Faça login novamente.");
        } else {
          throw new Error(msg);
        }
      } else {
        throw error;
      }
    }
  }

  // ======================================================
  // ⬇️ DOWNLOAD DE ARQUIVOS
  // ======================================================

  async download(service: string, params?: any): Promise<void> {
    try {
      const response = await this.client.post(`/execute`, {
        service,
        method: "download",
        params,
      }, {
        responseType: "blob",
      });

      this.handleFileDownload(response);
    } catch (error: any) {
      console.error(`❌ Erro ao baixar arquivo (${service}):`, error);
      throw error;
    }
  }

  private handleFileDownload(response: AxiosResponse<any>) {
    const disposition = response.headers["content-disposition"];
    const filenameMatch = disposition?.match(/filename="?([^"]+)"?/);
    const filename = filenameMatch ? filenameMatch[1] : "download";

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

const serverBack = new ServerClient();
export default serverBack;
