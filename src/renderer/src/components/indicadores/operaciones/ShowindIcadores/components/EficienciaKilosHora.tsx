/* eslint-disable prettier/prettier */

import { FilterValues } from "@renderer/hooks/useFiltro";
import { IndicadorKilosProcesados } from "../validations/types";
import { formatearFecha } from "@renderer/functions/fechas";
import { promedio } from "../function";
import { getISOWeek } from "date-fns";
import GraficoBarrasEficienciaKilosHora from "../graficos/GraficoBarrasEficienciaKilosHora";

type propsType = {
    data: IndicadorKilosProcesados[],
    currentFilters: FilterValues
}

const headers = [
    "Fecha",
    "Duración Turno",
    "Eficiencia Kilos Hora",
]

const headersSemana = [
    "Semana",
    "Promedio Duración Turno",
    "Promedio Eficiencia Kilos Hora",
]

export default function EficienciaKilosHora({
    data,
    currentFilters
}: propsType): JSX.Element {


    return (
        <div className="indicadores-operaciones-eficiencia-operativa-container">
            <div className="item1">
                <div className="table-container">
                    <table className="table-main">
                        <thead>
                            <tr>
                                {currentFilters.divisionTiempo === "dia" && headers.map(item => <th key={item}>{item}</th>)}
                                {currentFilters.divisionTiempo === "semana" && headersSemana.map(item => <th key={item}>{item}</th>)}
                                {currentFilters.divisionTiempo === "mes" && headersSemana.map(item => <th key={item}>{item}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.map((item, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                    {currentFilters.divisionTiempo === '' || currentFilters.divisionTiempo === 'dia' && <td>{formatearFecha(item.fecha)}</td>}
                                    {currentFilters.divisionTiempo === '' ||
                                        currentFilters.divisionTiempo === 'semana' && <td>{getISOWeek(new Date(item.fecha))}</td>}
                                    {currentFilters.divisionTiempo === '' ||
                                        currentFilters.divisionTiempo === 'mes' && <td>{(new Date(item.fecha).getMonth() + 1)}</td>}
                                                                            <td>{item.duracion_turno_horas?.toFixed(2) || 0}</td>
                                    <td>{item.eficiencia_procesado_hora?.toFixed(2) || 0} %</td>
                                </tr>

                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="item2">
                <div>
                    <h3>Sumatoria Eficiencia Kilos Procesados:</h3>
                    <h3>{data && data.reduce((acu, item) => acu += item.kilos_vaciados, 0)?.toFixed(2) || 0}</h3>
                </div>
                <div>
                    <h3>Promedio Eficiencia Kilos Procesados</h3>
                    <h3>{promedio(data, "eficiencia_procesado_hora")?.toFixed(2) || 0} %</h3>
                </div>

            </div>
            <div className="item3">
                <GraficoBarrasEficienciaKilosHora agrupacion={currentFilters.divisionTiempo} data={data} />
            </div>
        </div>
    )
}