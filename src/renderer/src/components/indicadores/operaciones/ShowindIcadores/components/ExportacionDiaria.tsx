/* eslint-disable prettier/prettier */

import { TABLE_COLUMNS_EXPORTACION } from "../constants/table"
import GraficoTortaExportacionProcesado from "../graficos/GraficoTortaExportacionProcesado"
import { itemExportacionType } from "../validations/types"
import { FilterValues } from "@renderer/hooks/useFiltro"
import ResumenExportaciones from "./ResumenExportaciones"
import './styles/ExportacionDiaria.css'

type propsType = {
    data: itemExportacionType[]
    dataOriginal: itemExportacionType[]
    currentFilters: FilterValues
    filtrosTipoFruta: string[];
    filtrosCalidad: string[];
    filtrosCalibre: string[];
}

export default function ExportacionDiaria({
    data, currentFilters, filtrosTipoFruta, filtrosCalidad, dataOriginal, filtrosCalibre
}: propsType): JSX.Element {

    const agrupacion = currentFilters.divisionTiempo || 'dia'; // fallback
    const columns = TABLE_COLUMNS_EXPORTACION[agrupacion] || TABLE_COLUMNS_EXPORTACION['dia'];

    return (
        <div className="exportacion-diaria-container">
            <div className="exportacion-diaria-tabla">
                <div className="table-container">
                    <table className="table-main">
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
                                        <td key={col.header}>{col.value(item, filtrosTipoFruta)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="exportacion-diaria-grafico">
                <GraficoTortaExportacionProcesado 
                    filtrosCalidad={filtrosCalidad}
                    filtrosCalibre={filtrosCalibre}
                    filtrosTipoFruta={filtrosTipoFruta}
                    agrupacion={currentFilters.divisionTiempo} 
                    dataOriginal={dataOriginal}
                    data={data} />
            </div>
            <div className="exportacion-diaria-resumen">
                <ResumenExportaciones 
                    data={data} 
                    filtrosCalidad={filtrosCalidad}
                    filtrosCalibre={filtrosCalibre}
                    filtrosTipoFruta={filtrosTipoFruta}
                />
            </div>
        </div>
    )
}