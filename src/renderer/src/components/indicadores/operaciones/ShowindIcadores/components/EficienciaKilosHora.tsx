/* eslint-disable prettier/prettier */

import { FilterValues } from "@renderer/hooks/useFiltro";
import { IndicadorKilosProcesados } from "../validations/types";
import { promedio } from "../function";
import GraficoBarrasEficienciaKilosHora from "../graficos/GraficoBarrasEficienciaKilosHora";
import { TABLE_COLUMNS_EFICIENCIA } from "../constants/table";

type propsType = {
    data: IndicadorKilosProcesados[],
    currentFilters: FilterValues
}

export default function EficienciaKilosHora({
    data,
    currentFilters
}: propsType): JSX.Element {

    const agrupacion = currentFilters.divisionTiempo || 'dia'; // fallback
    const columns = TABLE_COLUMNS_EFICIENCIA[agrupacion] || TABLE_COLUMNS_EFICIENCIA['dia'];

    return (
        <div className="indicadores-operaciones-eficiencia-operativa-container">
            <div className="item1">
                <div className="table-container">
                    <table className="table-main"
                        onContextMenu={(e): void => {
                            e.preventDefault();
                            window.api.mostrarMenuTabla();
                        }}
                    >
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