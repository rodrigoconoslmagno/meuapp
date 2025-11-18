// src/services/server.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";

type HttpMethod = "GET" | "POST";

class ServerClient {
  private client: AxiosInstance;
  private readonly TOKEN_KEY = "token";

  constructor() {
    const baseURL =
      import.meta.env.VITE_API_BASE_URL ||
      (window.location.hostname === "localhost"
        ? "http://localhost:8080/meuapp/api"
        : "https://api.meusistema.com/api");

    console.log("🌐 Server Base URL:", baseURL);

    this.client = axios.create({
      baseURL,
      timeout: 15000,
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
        console.log("analise status", status)
        if (status === 401) {
          console.warn("Sessão expirada ou não autorizada.");
          this.logout();
          window.location.href = "/"; // redireciona para login
        } else if (status === 403) {
          console.error("Acesso negado.");
        } else if (status >= 500) {
          console.error("Erro interno no servidor.");
        }

        return Promise.reject(error);
      }
    );
  }

  // ======================================================
  // 🔐 AUTENTICAÇÃO
  // ======================================================

  async login(login: string, password: string): Promise<string | undefined> {
    try {
      const response = await this.client.post<{ token: string, userName: string }>("/auth/login", {
        login,
        password,
      });
      const token = response.data?.token;
      if (token) {
        localStorage.setItem(this.TOKEN_KEY, token);
      }
      return response.data?.userName;
    } catch (error: any) {
      console.error("❌ Erro no login:", error);
      throw error;
    }
  }

  logout() {
    this.clearToken();
    window.location.href = "/";
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
