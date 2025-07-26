/* eslint-disable prettier/prettier */

import { lotesType } from "@renderer/types/lotesType";
import { filtroExportacionesSelectType, totalesLotesType } from "../validations/types";
import GraficoTortaEficienciaPredios from "../graficos/GraficoTortaEficienciaPredios";
import "./styles/eficienciaPredios.css"
import GraficosBarrasEficienciaPredios from "./GraficosBarrasEficienciaPredios";
import TablasRendimientoPredios from "../constants/TablasRendimientoPredios";

type propsType = {
    data: lotesType[];
    totalLotes: totalesLotesType;
    filtrosCalidad: string[];
    filtrosCalibre: string[];
    selectFiltroExportacion: filtroExportacionesSelectType
}

export default function EficienciaPredios({ data, totalLotes, filtrosCalidad, filtrosCalibre, selectFiltroExportacion }: propsType): JSX.Element {


    return (
        <div className="indicadores-operaciones-eficiencia-predios-container">
            <div>
                <h3 className="card-title">Resumen de Eficiencia</h3>
                <div className="table-container">
                    <TablasRendimientoPredios
                        totalLotes={totalLotes}
                        filtrosCalidad={filtrosCalidad}
                        filtrosCalibre={filtrosCalibre}
                        selectFiltroExportacion={selectFiltroExportacion} />
                </div>
            </div>
            <div>
                <GraficoTortaEficienciaPredios
                    filtrosCalibre={filtrosCalibre}
                    selectFiltroExportacion={selectFiltroExportacion}
                    filtrosCalidad={filtrosCalidad}
                    totalLotes={totalLotes}
                />
            </div>
            {!selectFiltroExportacion.calibre && (
                <GraficosBarrasEficienciaPredios data={data} filtrosCalidad={filtrosCalidad} />

            )}
        </div>
    )
}