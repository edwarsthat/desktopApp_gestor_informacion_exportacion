/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import ListaOrdenVaceo from "./components/ListaOrdenVaceo";
import PrediosEnInventario from "./components/PrediosEnInventario";
import "./css/predioCard.css"
import "./css/ordenVaceo.css"
import { useEffect, useState } from "react";
import useDataOrdenVaceo, { filtroPrediosInventarioType } from "./hooks/useDataOrdenVaceo";
import useGetSysData from "@renderer/hooks/useGetSysData";


export default function OrdenDeVaceo(): JSX.Element {
    const { eventoServidor, triggerServer } = useAppContext();
    const [filtroPrediosInventario, setFiltroPrediosInventario] = useState<filtroPrediosInventarioType>({ filtro: '', select: '' });
    const {
        obtenerData,
        handleAddOrdenVaceo,
        handleRemoveOrdenVaceo,
        handleMoveOrdenVaceo,
        lotes,
        lotesOrdenVaceo
    } = useDataOrdenVaceo({ filtroPrediosInventario });
    const { obtenerTipoFruta2, tiposFruta2 } = useGetSysData({});
    useEffect(() => {
        obtenerData()
        obtenerTipoFruta2();
    }, [])

    useEffect(() => {
        if (
            eventoServidor === 'add_lote' ||
            eventoServidor === 'vaciar_lote' ||
            eventoServidor === 'directo_nacional' ||
            eventoServidor === 'modificar_orden_vaceo' ||
            eventoServidor === 'modificar_historial_fruta_procesada' ||
            eventoServidor === 'inspeccion_fruta' ||
            eventoServidor === 'derogar_lote' ||
            eventoServidor === 'enviar_desverdizado' ||
            eventoServidor === 'finalizar_desverdizado'
        ) {
            obtenerData()
        }
    }, [triggerServer])
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Orden de vaceo</h2>
            <hr />
            <div className="componentContainer">
                <div className='orden-vaceo-div'>
                    <PrediosEnInventario
                        setFiltroPrediosInventario={setFiltroPrediosInventario}
                        filtroPrediosInventario={filtroPrediosInventario}
                        lotes={lotes}
                        tipoFrutas={tiposFruta2}
                        handleAddOrdenVaceo={handleAddOrdenVaceo} />
                    <ListaOrdenVaceo
                        obtenerData={obtenerData}
                        lotes={lotes}
                        handleRemoveOrdenVaceo={handleRemoveOrdenVaceo}
                        lotesOrdenVaceo={lotesOrdenVaceo}
                        handleMoveOrdenVaceo={handleMoveOrdenVaceo} />
                </div>
            </div>
        </div>
    )
}