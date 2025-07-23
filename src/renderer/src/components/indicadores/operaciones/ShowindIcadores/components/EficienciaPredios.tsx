/* eslint-disable prettier/prettier */

import { lotesType } from "@renderer/types/lotesType";
import { totalesLotesType } from "../validations/types";
import GraficoTortaEficienciaPredios from "../graficos/GraficoTortaEficienciaPredios";
import "./styles/eficienciaPredios.css"
import TablasRendimientoPredios from "../constants/tablasRendimientoPredios";
import GraficosBarrasEficienciaPredios from "./GraficosBarrasEficienciaPredios";

type propsType = {
    data: lotesType[];
    totalLotes: totalesLotesType;
    filtrosCalidad: string[];
}

export default function EficienciaPredios({ data, totalLotes, filtrosCalidad }: propsType): JSX.Element {


    return (
        <div className="indicadores-operaciones-eficiencia-predios-container">
            <div>
                <h3 className="card-title">Resumen de Eficiencia</h3>
                <div className="table-container">
                    <TablasRendimientoPredios totalLotes={totalLotes} filtrosCalidad={filtrosCalidad} />
                </div>
            </div>
            <div>
                <GraficoTortaEficienciaPredios
                    filtrosCalidad={filtrosCalidad}
                    totalLotes={totalLotes}
                />
            </div>
            <GraficosBarrasEficienciaPredios data={data} filtrosCalidad={filtrosCalidad} />
        </div>
    )
}