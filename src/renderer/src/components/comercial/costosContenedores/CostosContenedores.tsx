/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { useState } from "react";
import CostosContenedoresFiltros from "./components/CostosContenedoresFiltros";
import { costoContenedorData } from "./types";
import CostoContenedoresInfo from "./components/CostoContenedoresInfo";

export default function CostosContenedores(): JSX.Element {

    const { messageModal, setLoading } = useAppContext();
    const [showData, setShowData] = useState<boolean>(false);
    const [dataContenedores, setDataContenedores] = useState<costoContenedorData>({});
    const [totalCalidad, setTotalCalidad] = useState<{ [calidad: string]: number }>({})

    const handlebuscar = async (
        numeroContenedor: string[],
        fechainicio: string | undefined,
        fechaFin: string | undefined,
        clientes: string[],
        tipoFruta: string
    ): Promise<void> => {
        try {
            setLoading(true);
            const query = {
                action: "get_comercial_costo_contenedores",
                contenedores: numeroContenedor,
                fechaInicio: fechainicio,
                fechaFin: fechaFin,
                clientes: clientes,
                tipoFruta: tipoFruta
            }
            const response = await window.api.server2(query)

            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            console.log(response.data);
            if(!response.data) throw new Error("No se encontraron datos con los filtros seleccionados")
            setDataContenedores(response.data.preciosContenedores);
            setTotalCalidad(response.data.totalPrecioCalidades);
            setShowData(true);
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <div className="navBar"></div>
            <h2>Costos de Contenedores</h2>
            <hr />
            {showData ?
                <CostoContenedoresInfo data={dataContenedores} totalCalidad={totalCalidad} setShowData={setShowData}/>
                :
                <CostosContenedoresFiltros handlebuscar={handlebuscar} />}
        </div>
    )
}