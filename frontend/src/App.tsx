  // src/App.tsx
  import 'primereact/resources/themes/lara-light-blue/theme.css';
  import 'primereact/resources/primereact.min.css';
  import 'primeicons/primeicons.css';
  import 'primeflex/primeflex.css';
  import './App.css'
  import GlobalConfirm from './utils/GlobalConfirm';
  import GlobalToast from './utils/GlobalToast';
  import AppRoutes from "@/routes/AppRoutes";
  import { LayoutProvider } from './componentes/Layout/LayoutContext';
import { ConfirmDialog } from 'primereact/confirmdialog';

  function App() {
    return  (
      <LayoutProvider>
          <GlobalConfirm />
          <GlobalToast />
          <AppRoutes />
        </LayoutProvider>
    );
  }

  export default App
