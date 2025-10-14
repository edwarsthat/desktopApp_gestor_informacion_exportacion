/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext";
import HistorialContenedoresFiltros from "./components/HistorialContenedoresFiltros";
import './style/filtros_styles.css'
import './style/data_styles.css'
import { useState } from "react";
import { contenedoresType } from "@renderer/types/contenedoresType";
import DataHistorialContenedores from "./components/DataHistorialContenedores";
import { resumenContenedores } from "@renderer/types/responses/resumenContenedores";

export default function Contenedores():JSX.Element{
    const { messageModal } = useAppContext();
    const [showData, setShowData] = useState<boolean>(false);
    const [dataContenedores, setDataContenedores] = useState<contenedoresType[]>();
    const [resumen, setResumen] = useState<resumenContenedores>();


    const handlebuscar = async (
        numeroContenedor: string[],
        fechainicio:string | undefined,
        fechaFin:string | undefined,
        clientes: string[],
        tipoFruta:string
    ):Promise<void> => {
        try{
            const query = {
                action: "get_inventarios_historiales_contenedores",
                contenedores: numeroContenedor,
                fechaInicio: fechainicio,
                fechaFin:fechaFin,
                clientes: clientes,
                tipoFruta:tipoFruta
            }
            const response = await window.api.server2(query)

            if(response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)

            console.log(response);
            setDataContenedores(response.data.contenedores);
            setResumen(response.data);
            setShowData(true);
        } catch(err){
            if(err instanceof Error){
                messageModal("error", err.message);
            }
        }
    }
    return(
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Busqueda Contenedores</h2>
            <hr />
            {showData ?
            <DataHistorialContenedores
                resumen={resumen}
                dataContenedores={dataContenedores} 
                setShowData={setShowData} /> :
            <HistorialContenedoresFiltros handlebuscar={handlebuscar}/>

        }
        </div>
    )
}
