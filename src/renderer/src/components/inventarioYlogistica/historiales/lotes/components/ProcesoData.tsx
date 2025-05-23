/* eslint-disable prettier/prettier */

import { dataContext } from "@renderer/App"
import { useContext, useEffect, useState } from "react"
import FiltrosColumnas from "../utils/FiltrosColumnas"
import { filtroColumnasType } from "../type/types"
import { filtrosColumnasObj } from "../functions/functions"
import GraficasBarras from "../utils/GraficasBarras"
import GraficaLineal from "../utils/GraficaLineal"
import GraficaCircular from "../utils/GraficaCircular"
import TableInfoLotes from "../table/TableInfoLotes"
import PromediosProceso from "../utils/PromediosProceso"
import TotalesProceso from "../utils/TotalesProceso"
import useLotes from "../hooks/useLotes"
import Filtros from "@renderer/components/UI/components/Filtros"
import { useFiltroValue } from "@renderer/hooks/useFiltro"

export default function ProcesoData(): JSX.Element {

    const dataGlobal = useContext(dataContext);
    if (!dataGlobal) {
        throw new Error("Error informes context data global")
    }
    const [columnVisibility, setColumnVisibility] = useState<filtroColumnasType>(filtrosColumnasObj)
    const { setCurrentFilters, currentFilters } = useFiltroValue();
    const {
        obtenerProveedores,
        obtenerData,
        data,
        prediosInfo,
        numeroContenedor
    } = useLotes({ currentFilters });

    const [tipoGraficas, setTipoGraficas] = useState<string>('')
    //vuelve a pedir los datos al servidor
    // const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        obtenerProveedores()
    }, [])

    // useEffect(() => {
    //     const saved = localStorage.getItem("lotes_filtro_rows");
    //     const savedCol = localStorage.getItem("lotes_filtro_col");
    //     if (saved) {
    //         setFiltro(JSON.parse(saved))
    //     }
    //     if (savedCol) {
    //         // Migrar el objeto guardado para incluir el nuevo campo
    //         const parsedCol = JSON.parse(savedCol);
    //         const updatedCol = {
    //             ...filtrosColumnasObj, // Esto asegura que todos los campos estén presentes
    //             ...parsedCol, // Sobrescribe con los valores guardados
    //         };
    //         setColumnVisibility(updatedCol);

    //         // Guardar el objeto actualizado de vuelta en localStorage
    //         localStorage.setItem("lotes_filtro_col", JSON.stringify(updatedCol));
    //     } else {
    //         // Si no hay nada guardado, usar el objeto por defecto
    //         setColumnVisibility(filtrosColumnasObj);
    //         localStorage.setItem("lotes_filtro_col", JSON.stringify(filtrosColumnasObj));
    //     }
    //     window.api.reload(() => {
    //         setReload(!reload)
    //     });
    //     window.api.Descargar(() => {
    //         const dataOrdenada = ordenarDataExcel(data, columnVisibility, numeroContenedor)
    //         const dataR = JSON.stringify(dataOrdenada)
    //         window.api.crearDocumento(dataR)
    //     })
    //     return () => {
    //         window.api.removeReload()
    //     }
    // }, [reload])


    const handleChange = (e): void => {
        setColumnVisibility({
            ...columnVisibility,
            [e.target.value]: e.target.checked,
        });
    }
    const buscar = async (): Promise<void> => {
        // localStorage.setItem("lotes_filtro_rows", JSON.stringify(filtro))
        // localStorage.setItem("lotes_filtro_col", JSON.stringify(columnVisibility))
        await obtenerData()
    }

    return (
        <div className="componentContainer">
            <div>
                <h2>Lotes proceso</h2>
            </div>
            <div className="filtroContainer">
                <div>
                    <FiltrosColumnas columnVisibility={columnVisibility} handleChange={handleChange} />
                </div>
            </div>
            <Filtros
                showFechaInicio={true}
                showFechaFin={true}
                showTipoFruta={true}
                showGGN={true}
                ggnId="proceso-data-lotes"
                showProveedor={true}
                showTipoFecha={true}
                showEF={true}
                showButton={true}
                showAll={true}
                allId="proceso-data-lotes-all"
                findFunction={buscar}
                onFiltersChange={setCurrentFilters}/>
            <div>
                <PromediosProceso data={data} columnVisibility={columnVisibility} />
            </div>

            <div className="lotes-select-tipo-grafica-div">
                <select className="defaultSelect" onChange={(e): void => setTipoGraficas(e.target.value)}>
                    <option value="">Tipo de gráficas</option>
                    <option value="barras">Grafica de barras</option>
                    <option value="lineal">Grafica lineal</option>
                    <option value="circular">Grafica circular</option>
                </select>
            </div>
            <div className="lotes-grafica-container">
                {tipoGraficas === 'barras' && <GraficasBarras data={data} />}
                {tipoGraficas === 'lineal' && <GraficaLineal data={data} />}
                {tipoGraficas === 'circular' && <GraficaCircular data={data} />}
            </div>
            <div>
                <TotalesProceso data={data} columnVisibility={columnVisibility} />
            </div>

            <div>
                <TableInfoLotes
                    data={data}
                    prediosInfo={prediosInfo}
                    numeroContenedor={numeroContenedor}
                    columnVisibility={columnVisibility} />
            </div>
        </div>
    )
}
