/* eslint-disable prettier/prettier */

import FormSelect from "@renderer/components/UI/components/FormSelect";
import useAppContext from "@renderer/hooks/useAppContext";
import { useEffect, useState } from "react";
import CamionForm from "./components/CamionForm";
import { contenedoresType } from "@renderer/types/contenedoresType";
import TractomulaForm from "./components/TractomulaForm";

export default function TransporteProgramacionMula(): JSX.Element {
    const { messageModal } = useAppContext();
    const [contenedores, setContenedores] = useState<contenedoresType[]>([]);
    const [formularioType, setFormularioType] = useState<string>("");

    const obtenerData = async (): Promise<void> => {
        try {
            const request = {
                action: "get_transporte_programaciones_mulaContenedores"
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setContenedores(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    useEffect(() => {
        obtenerData();
    }, [])

    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Programacion Transporte Salida</h2>
            <hr />
            <form className="form-container">
                <FormSelect
                    name="Tipo de vehiculo"
                    value={formularioType}
                    label={"Tipo de vehiculo"}
                    onChange={(e): void => {
                        setFormularioType(e.target.value);
                    }}
                    data={[{ name: "Tractomula", _id: "Tractomula" }, { name: "Camion", _id: "Camion" }]}
                />
                {formularioType === "Camion" && <CamionForm contenedores={contenedores} formularioType={formularioType} obtenerData={obtenerData} />}
                {formularioType === "Tractomula" && <TractomulaForm contenedores={contenedores} formularioType={formularioType} obtenerData={obtenerData} />}

            </form>
        </div>
    )
}