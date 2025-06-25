/* eslint-disable prettier/prettier */

import { FilterValues } from "@renderer/hooks/useFiltro";
import { IndicadorKilosProcesados } from "../validations/types";
import { formatearFecha } from "@renderer/functions/fechas";
import GraficoBarrasEficienciaOperativa from "../graficos/GraficoBarrasEficienciaOperativa";
import { promedio } from "../function";
import { getISOWeek } from "date-fns";

type propsType = {
    data: IndicadorKilosProcesados[],
    currentFilters: FilterValues
}

const headers = [
    "Fecha",
    "Meta Kilos/Hora",
    "Duración Turno",
    "Meta Kilos Turno",
    "Kilos Procesados (Kg)",
    "Kilos Procesados (Hora)"
]

const headersSemana = [
    "Semana",
    "Promedio Meta Kilos/Hora",
    "Promedio Duración Turno",
    "Promedio Meta Kilos Turno",
    "Promedio Kilos Procesados (Kg)",
    "Promedio Kilos Procesados (Hora)"
]

export default function EficienciaOperativaComponent({
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
                                { currentFilters.divisionTiempo === "dia" && headers.map(item => <th key={item}>{item}</th>)}
                                { currentFilters.divisionTiempo === "semana" && headersSemana.map(item => <th key={item}>{item}</th>)}
                                { currentFilters.divisionTiempo === "mes" && headersSemana.map(item => <th key={item}>{item}</th>)}
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
                                    <td>{item.meta_kilos_hora?.toFixed(2) || 0}</td>
                                    <td>{item.duracion_turno_horas?.toFixed(2) || 0}</td>
                                    <td>{item.meta_kilos_turno?.toFixed(2) || 0}</td>
                                    <td>{item.kilos_vaciados?.toFixed(2) || 0}</td>
                                    <td>{item.kilos_hora?.toFixed(2) || 0}</td>
                                </tr>

                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="item2">
                <div>
                    <h3>Sumatoria Kilos Procesados:</h3>
                    <h3>{data && data.reduce((acu, item) => acu += item.kilos_vaciados, 0)?.toFixed(2) || 0}</h3>
                </div>
                <div>
                    <h3>Promedio Kilos Procesados</h3>
                    <h3>{promedio(data, "kilos_vaciados")?.toFixed(2) || 0}</h3>
                </div>
                <div>
                    <h3>Promedio Kilos Procesados por Hora</h3>
                    <h3>{promedio(data, "kilos_hora")?.toFixed(2) || 0}</h3>

                </div>
            </div>
            <div className="item3">
                <GraficoBarrasEficienciaOperativa agrupacion={currentFilters.divisionTiempo} data={data} />
            </div>
        </div>
    )
}