import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css";
import GlobalConfirm from "@/utils/GlobalConfirm";
import GlobalToast from "@/utils/GlobalToast";
import AppRoutes from "@/routes/AppRoutes";
import { LayoutProvider } from "./componentes/Layout/LayoutContext";
import { AuthProvider } from "@/context/AuthContext"; 
import { BrowserRouter } from "react-router-dom";

const pathParts = window.location.pathname.split('/');
const contextPath = pathParts.length > 1 && pathParts[1] ? `/${pathParts[1]}` : '';

function App() {
  return (
    <AuthProvider>
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
