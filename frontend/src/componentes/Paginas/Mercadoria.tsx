import { Mercadoria } from "@/entidades/Mercadoria"
import { Crud } from "@/componentes/Crud/Crud"
import { FormGroup } from "../Crud/FormGroup";

export default function Mercadorias() {
    return (
      <Crud<Mercadoria, null>
        pageTitle="Mercadoria"
        serviceName="mercadoriaService"
        entityType={Mercadoria}
        columns={[]}
        emptyModel={{descricao: undefined}}
        emptyFilter={null}
        itemIdField="id"
        renderForm={(mercadoria, onChange) => 
          <>

          </>
        }
      />
    );
  }