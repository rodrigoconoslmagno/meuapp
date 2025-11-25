import { Mercadoria } from "@/entidades/Mercadoria"
import { Crud } from "../Crud/Crud"

export default function Produtos() {
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
          <></>
        }
      />
    );
  }