// src/App.tsx
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css";
import GlobalConfirm from "@/utils/GlobalConfirm";
import GlobalToast from "@/utils/GlobalToast";
import AppRoutes from "@/routes/AppRoutes";
import { LayoutProvider } from "./componentes/Layout/LayoutContext";
import { AuthProvider } from "@/context/AuthContext"; // ✅ importar o AuthProvider
import { BrowserRouter } from "react-router-dom";

// 🔹 Detecta dinamicamente o contexto do Tomcat (ex: /meuapp, /clienteA, etc.)
// Detecta dinamicamente o contexto base a partir do path atual
const pathParts = window.location.pathname.split('/');
const contextPath = pathParts.length > 1 && pathParts[1] ? `/${pathParts[1]}` : '';

function App() {
  return (
    <AuthProvider> {/* ✅ envolve toda a aplicação */}
      <BrowserRouter basename={contextPath}>
        <LayoutProvider>
          <GlobalToast />
          <GlobalConfirm />
          <AppRoutes />
        </LayoutProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
