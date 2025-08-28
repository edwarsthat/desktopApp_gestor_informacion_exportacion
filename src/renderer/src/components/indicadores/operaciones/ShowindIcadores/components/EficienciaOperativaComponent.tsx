/* eslint-disable prettier/prettier */

import { FilterValues } from "@renderer/hooks/useFiltro";
import { IndicadorKilosProcesados } from "../validations/types";
import GraficoBarrasEficienciaOperativa from "../graficos/GraficoBarrasEficienciaOperativa";
import { promedio } from "../function";
import { TABLE_KILOS_HORA } from "../constants/table";

type propsType = {
    data: IndicadorKilosProcesados[],
    currentFilters: FilterValues
}


export default function EficienciaOperativaComponent({
    data,
    currentFilters
}: propsType): JSX.Element {

    const agrupacion = currentFilters.divisionTiempo || 'dia'; // fallback
    const columns = TABLE_KILOS_HORA[agrupacion] || TABLE_KILOS_HORA['dia'];

    return (
        <div className="indicadores-operaciones-eficiencia-operativa-container">
            <div className="item1">
                <div className="table-container">
                    <table
                        onContextMenu={(e): void => {
                            e.preventDefault();
                            window.api.mostrarMenuTabla();
                        }}
                        className="table-main">
                        <thead>
                            <tr>
                                {columns.map(col => (
                                    <th key={col.header}>{col.header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.map((item, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                    {columns.map(col => (
                                        <td key={col.header}>{col.value(item)}</td>
                                    ))}
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