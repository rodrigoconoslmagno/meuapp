import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { UIHelper } from "@/utils/UIHelper";
import session from "@/utils/session";

class ServerClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const contextPath = pathParts.length > 0 && !pathParts[0].includes(".")
      ? `/${pathParts[0]}`
      : "";

    const isLocalDev = window.location.port === "5173";
    const baseURL = isLocalDev
      ? `http://localhost:8080${contextPath}/api`
      : `${window.location.origin}${contextPath}/api`;

    this.client = axios.create({
      baseURL,
      timeout: 15_000,
      headers: { "Content-Type": "application/json" },
      withCredentials: true, 
    });

    this.client.interceptors.request.use((config) => {
      const token = this.accessToken; 
      if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
  });

  this.client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }; 
      const requestUrl = originalRequest.url || "";

      if (status === 401 && requestUrl.includes("/auth/login")) {
           return Promise.reject(error);
      }
      
      if (status === 403) {
          UIHelper.error("Acesso negado.");
      } else if (status >= 500) {
          UIHelper.error("Erro interno no servidor.");
      }

      console.log("Validando tempo de sessao", error, this.getToken())
      return Promise.reject(error);
    }
  );
  }

  public async refreshToken(): Promise<string | null> {
    try {
        console.log("refresh valida token", this.accessToken)
        if (this.accessToken){
          this.accessToken = null;
        }
        const response = await this.client.post<{ token: string }>("/auth/refresh-token"); 
        const newAccessToken: string = response.data.token;
        
        this.accessToken = newAccessToken; 
        console.log("refresh sucess", this.accessToken);
    } catch (error: any) {
        this.logout(); 
        throw error; 
    } finally {
      return this.accessToken;
    }
  }

  async login(login: string, password: string): Promise<{ token: string, userName: string }> {
    try {
      const response = await this.client.post<{ token: string, userName: string }>("/auth/login", {
        login,
        password,
      });
      const { token, userName } = response.data;
      if (token) {
        this.accessToken = token; 
      }
      return { token , userName };
    } catch (error: any) {
      console.error("❌ Erro no login:", error);
      throw error;
    }
  }

  async logout() {
    try {
        await this.client.post("/auth/logout"); 
    } catch (e) {
        console.error("Erro ao chamar endpoint de logout, limpando localmente.", e);
    }
    
    this.accessToken = null;
  }

  public getToken(): string | null {
    return this.accessToken; 
  }

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
          throw new Error(msg);
        } else if (status === 401) {
          await this.refreshToken();
          if (!this.accessToken){
            console.log("chegou erro de token")
            this.logout();
            window.location.reload();
            session.setMsgError("Sessão expirada. Faça login novamente.");
            //throw new Error("Sessão expirada. Faça login novamente.");
            return error;
          } else {
            return this.invoke(service, action, payload)
          }
        } else {
          throw new Error(msg);
        }
      } else {
        throw error;
      }
    }
  }

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
