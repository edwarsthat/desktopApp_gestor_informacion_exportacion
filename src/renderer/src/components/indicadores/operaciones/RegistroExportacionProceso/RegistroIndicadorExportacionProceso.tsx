/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas";
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList";
import { indicadoresType } from "@renderer/types/indicadoresType";
import { useEffect, useState } from "react";
import { total_exportacion, total_procesado } from "./services/exportacion";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";

const headers = [
    "Fecha",
    "Kilos Procesados",
    "Kilos Exportados",
    "% Exportados",
]
export default function RegistroIndicadorExportacionProceso(): JSX.Element {

    const [page, setPage] = useState<number>(1);

    const { obtenerCantidadElementos, obtenerData, data, numeroElementos } = useFetchPaginatedList<indicadoresType>({
        actionData: "get_indicadores_operaciones_eficienciaOperativa",
        actionNumberData: "get_indicadores_proceso_numero_items",
        page: page
    })

    useEffect(() => {
        obtenerCantidadElementos()
    }, []);
    useEffect(() => {
        obtenerData()
    }, [page])

    const safeService = (fn: () => number): number => {
        try { return fn() ?? 0 } catch { return 0 }
    };
    return (
        <div>
            <div className="navBar"></div>
            <h2>Registros Exportación Procesado</h2>
            <hr />
            <div className="table-container">
                <table className="table-main">
                    <thead>
                        <tr>
                            {headers.map(item => (
                                <th key={item}>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(data ?? []).map((registro, index) => {

                            const procesado_kilos = safeService(() => total_procesado(registro));
                            const exportacion_kilos = safeService(() => total_exportacion(registro));
                            const porcentaje_exportacion = procesado_kilos > 0
                                ? (exportacion_kilos / procesado_kilos) * 100
                                : 0;
                                
                            return (
                                <tr key={registro._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                    <td>{formatearFecha(registro.fecha_creacion)}</td>
                                    <td>{procesado_kilos?.toFixed(2) || 0}</td>
                                    <td>{exportacion_kilos?.toFixed(2) || 0}</td>
                                    <td>{porcentaje_exportacion?.toFixed(2) || 0}%</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <BotonesPasarPaginas
                division={50}
                page={page}
                numeroElementos={numeroElementos}
                setPage={setPage}
            />
        </div>
    )
}