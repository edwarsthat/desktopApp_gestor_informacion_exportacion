/* eslint-disable prettier/prettier */

import Filtros from "@renderer/components/UI/components/Filtros";
import { useFiltroValue } from "@renderer/hooks/useFiltro"
import { useState } from "react";
import EficienciaOperativaComponent from "./components/EficienciaOperativaComponent";
import { indicadoresType } from "@renderer/types/indicadoresType";
import useAppContext from "@renderer/hooks/useAppContext";
import { validateFrutapRocesadaHora } from "./validations/requestValidations";
import { z } from "zod";
import { agruparRegistros } from "./function";



export default function ShowIndicadores(): JSX.Element {
    const { setLoading, messageModal } = useAppContext();
    const { setCurrentFilters, currentFilters } = useFiltroValue();
    const [data, setData] = useState<indicadoresType[]>([]);


    const buscar = async (): Promise<void> => {
        try {
            setLoading(true);
            validateFrutapRocesadaHora.parse(currentFilters);

            const request = {
                action: "get_indicadores_operaciones_kilosProcesados",
                filtro: currentFilters
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            console.log("la respuesta ", response.data);

            const dataFiltrada = agruparRegistros(response.data, currentFilters.divisionTiempo);
            setData(dataFiltrada);
        } catch (err) {
            // Manejar errores de validación de Zod
            if (err instanceof z.ZodError) {
                const errorMessages = err.errors.map(error => {
                    const field = error.path.length > 0 ? error.path.join('.') : 'campo';
                    return `${field}: ${error.message}`;
                }).join('\n');

                messageModal("error", `Errores de validación:\n${errorMessages}`);
            } else if (err instanceof Error) {
                messageModal("error", `Error al buscar los registros: ${err.message}`);
            } else {
                messageModal("error", "Error desconocido al buscar los registros");
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <div>
            <div className="navBar"></div>
            <h2>Indicadores Operativos</h2>
            <hr />

            <Filtros
                showDivisionTiempo={true}
                showFechaInicio={true}
                showFechaFin={true}
                showButton={true}
                findFunction={buscar}
                ggnId="indicadoresGGN"
                onFiltersChange={setCurrentFilters}
                />

            {/* <EficienciaOperativaComponent  currentFilters={currentFilters} setBuscar={setBuscar} />  */}

        </div>
    )
}

//     const [dataLotes, setDataLotes] = useState<outTypeLoteIndicadores[]>()
//     const [lotes, setLotes] = useState<lotesType[]>()
//     const [dataOriginal, setDataOriginal] = useState<indicadoresType[]>();
//     const [volanteCalidad, setVolanteCalidad] = useState<volanteCalidadType[]>()
//     const [volanteCalidadOriginal, setVolanteCalidadOriginal] = useState<volanteCalidadType[]>()

//     const [filtro, setFiltro] = useState<filtroType>();
//     const [agrupado, setAgrupado] = useState<string>("dia");
//     const [indicador, setIndicador] = useState<string>('')

//     const obtenerRegistros = async (): Promise<void> => {
//         try {
//             const request = {
//                 action: "get_indicadores_operaciones_registrosDiarios",
//                 filtro: filtro
//             }
//             const response = await window.api.server2(request);
//             if (response.status !== 200) {
//                 throw new Error(`Code ${response.status}: ${response.message}`);
//             }
//             const dataFiltrada = agruparRegistros(response.data, agrupado);
//             setData(JSON.parse(JSON.stringify(dataFiltrada)));
//             setDataOriginal(JSON.parse(JSON.stringify(response.data)));
//         } catch (err) {
//             if (err instanceof Error) {
//                 messageModal("error", err.message);
//             }
//         }
//     }
//     const obtenerLotes = async (): Promise<void> => {
//         try {
//             const request = {
//                 action: "get_indicadores_operaciones_lotes",
//                 filtro: filtro
//             }
//             const response = await window.api.server2(request);
//             if (response.status !== 200) {
//                 throw new Error(`Code ${response.status}: ${response.message}`);
//             }
//             const datalotes = agrupar_lotes(response.data, agrupado)
//             setDataLotes(JSON.parse(JSON.stringify(datalotes)));
//             // setDataLotesOriginales(JSON.parse(JSON.stringify(response.data)));
//             setLotes(response.data)

//         } catch (err) {
//             if (err instanceof Error) {
//                 messageModal("error", err.message)
//             }
//         }
//     }
//     const obtenerDatosVolanteCalidad = async (): Promise<void> => {
//         try {
//             const request = {
//                 action: "get_indicadores_operaciones_noCalidad",
//                 filtro: filtro
//             }
//             const response = await window.api.server2(request)
//             if (response.status !== 200) {
//                 throw new Error(`Code ${response.status}: ${response.message}`)
//             }
//             const dataFiltrada = agrupar_volante_calidad(response.data, agrupado);
//             setVolanteCalidad(JSON.parse(JSON.stringify(dataFiltrada)));
//             setVolanteCalidadOriginal(JSON.parse(JSON.stringify(response.data)));
            
//         } catch (err) {
//             if (err instanceof Error) {
//                 messageModal("error", err.message)
//             }
//         }
//     }
//     const obtenerDataHandler = (): void => {
//         if (indicador === "EficienciaOperativa" || indicador === 'EficienciaFruta') {
//             obtenerRegistros()
//         } else if (indicador === 'tiempoCicloPredios') {
//             obtenerLotes()
//         } else if (indicador === 'NoCalidad') {
//             obtenerDatosVolanteCalidad()
//         }
//     }

//     // useEffect(() => {
//     //     obtenerRegistros();
//     //     obtenerLotes();
//     // }, [])

//     useEffect(() => {
//         const dataFiltrada = agruparRegistros(dataOriginal, agrupado);
//         setData([...dataFiltrada])
//         const dataLotesFiltrados = agrupar_lotes(lotes, agrupado);
//         setDataLotes([...dataLotesFiltrados])
//         const dataVolanteCalidad = agrupar_volante_calidad(volanteCalidadOriginal, agrupado);
//         setVolanteCalidad([...dataVolanteCalidad])


//     }, [agrupado])
//     return (
//         <div>
//             <div className="navBar"></div>
//             <h2>Eficiencia Operativa</h2>
//             <hr />
//             <FiltroEficienciaOperativa
//                 setIndicador={setIndicador}
//                 indicador={indicador}
//                 setAgrupado={setAgrupado}
//                 agrupado={agrupado}
//                 setFiltro={setFiltro}
//                 filtro={filtro}
//                 obtenerRegistros={obtenerDataHandler} />
//             {(data === undefined) ||
//                 (volanteCalidad === undefined) ||
//                 (dataLotes === undefined) ?
//                 <div>Loading...</div> :

//                 <>
//                     {/* {indicador === 'EficienciaOperativa' &&
//                         <EficienciaOperativaComponent data={data} agrupado={agrupado} />} */}
//                     {indicador === 'EficienciaFruta' &&
//                         <EficienciaFrutaComponent data={data} agrupado={agrupado} />}
//                     {indicador === 'tiempoCicloPredios' &&
//                         <TiempoCicloPredios data={dataLotes} agrupado={agrupado} />}
//                     {indicador === 'NoCalidad' &&
//                         <NoCalidad data={volanteCalidad} agrupado={agrupado} />}
//                 </>
//             }


//         </div>
//     )
// }
