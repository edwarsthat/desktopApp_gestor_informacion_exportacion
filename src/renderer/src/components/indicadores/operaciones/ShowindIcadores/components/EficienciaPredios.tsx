/* eslint-disable prettier/prettier */

import { dataLotesType, filtroExportacionesSelectType, totalesLotesType } from "../validations/types";
import GraficoTortaEficienciaPredios from "../graficos/GraficoTortaEficienciaPredios";
import "./styles/eficienciaPredios.css"
import GraficosBarrasEficienciaPredios from "./GraficosBarrasEficienciaPredios";
import TablasRendimientoPredios from "../constants/TablasRendimientoPredios";
import { lotesType } from "@renderer/types/lotesType";

type propsType = {
    dataCalibres: dataLotesType[];
    dataCalidades: dataLotesType[];
    totalLotes: totalesLotesType;
    filtrosCalidad: string[];
    filtrosCalibre: string[];
    selectFiltroExportacion: filtroExportacionesSelectType
    lotes: lotesType[];
}

export default function EficienciaPredios({ lotes, dataCalibres, dataCalidades, totalLotes, filtrosCalidad, filtrosCalibre, selectFiltroExportacion }: propsType): JSX.Element {


    return (
        <div className="indicadores-operaciones-eficiencia-predios-container">
            <div>
                <h3 className="card-title">Resumen de Eficiencia</h3>
                <div className="table-container">
                    <TablasRendimientoPredios
                        dataCalibres={dataCalibres}
                        dataCalidades={dataCalidades}
                        totalLotes={totalLotes}
                        filtrosCalidad={filtrosCalidad}
                        filtrosCalibre={filtrosCalibre}
                        selectFiltroExportacion={selectFiltroExportacion} />
                </div>
            </div>
            <div>
                <GraficoTortaEficienciaPredios
                    dataCalibres={dataCalibres}
                    dataCalidades={dataCalidades}
                    filtrosCalibre={filtrosCalibre}
                    selectFiltroExportacion={selectFiltroExportacion}
                    filtrosCalidad={filtrosCalidad}
                    totalLotes={totalLotes}
                />
            </div>
            {!selectFiltroExportacion.calibre && (
                <GraficosBarrasEficienciaPredios
                    lotes={lotes}
                    filtrosCalidad={filtrosCalidad} 
                />

            )}
        </div>
    )
}