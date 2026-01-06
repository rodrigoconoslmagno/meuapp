import { Crud } from "@/componentes/Crud/Crud";
import { Participante } from "@/entidades/Participante";
import { FormGroup } from "../Crud/FormGroup";
import { LabelText } from "../label/LabelText";
import { Formatter } from "@/utils/Formatter";
import { EditText } from "../Inputs/EditText";
import { useEffect, useState } from "react";
import { FormatType } from "@/types/FormatTypes";

export default function Participantes() {
    const [cnpjCpf, setCnpjCpf] = useState<string | undefined>(''); 

    useEffect(() => {
        //setCnpjCpf(Formatter.formatarCnpjCpf(cnpjCpf, Formatter.getCnpjCpfPlaceholder(cnpjCpf)));
    }, [cnpjCpf]);

    return (
        <Crud<Participante, null>
            pageTitle="Participante"
            serviceName="participanteService"
            entityType={Participante}
            columns={[]}
            emptyModel={{cnpjCpf: undefined, nome: undefined, nomeFantasia: undefined, participanteTipo: []}}
            emptyFilter={null}
            itemIdField="id"
            renderForm={(participante, onChange) => 
                <>
                    <FormGroup title="Dados Principais">
                        <LabelText id="dtCriacao" label="Data Criação" value={Formatter.formatarDataHora(participante.dataCriacao)} col="6" />
                        <LabelText id="dtArualizacao" label="Data Alteração" value={Formatter.formatarDataHora(participante.dataAtualizacao)} col="6" />

                        <EditText id="cnpjCpf" label="CNPJ/CPF" value={cnpjCpf} maxLength={18} formatType={FormatType.CnpjCpf}
                                    onChange={(v) => {
                                        onChange("cnpjCpf", v)
                                        setCnpjCpf(v)
                                    }} col="6" required />
                        <EditText id="nome" label="Nome" value={participante.nome} onChange={(v) => onChange("nome", v)} col="6" required/>
                    </FormGroup>
                </>
            }
        />
    );
}