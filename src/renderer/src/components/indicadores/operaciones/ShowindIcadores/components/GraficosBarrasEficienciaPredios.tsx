/* eslint-disable prettier/prettier */

import { lotesType } from "@renderer/types/lotesType";
import GraficoBarrasLotesDatos from "../graficos/GraficoBarrasLotesDatos";
import { totalesLotesType } from "../validations/types";

type propsType = {
    filtrosCalidad: string[];
    data: lotesType[];
    totalLotes: totalesLotesType;

}

export default function GraficosBarrasEficienciaPredios({ data, filtrosCalidad, totalLotes }: propsType): JSX.Element {
    if (filtrosCalidad.length > 0) {
        return (
            <>
                { Object.keys(totalLotes.calidades || {}).map(calidadId => {
                    if(filtrosCalidad.includes(calidadId)) {
                        return (
                            <div key={calidadId}>
                                <GraficoBarrasLotesDatos
                                    data={data}
                                    titulo={calidadId}
                                    elemento={calidadId} />
                            </div>
                        );
                    }
                    return null
                }) }

            </>
        )
    }
    return (
        <>
            <div>
                <GraficoBarrasLotesDatos
                    data={data}
                    titulo="Ingresados"
                    elemento="kilos" />
            </div>
            <div>
                <GraficoBarrasLotesDatos
                    data={data}
                    titulo="Procesados"
                    elemento="kilosVaciados" />
            </div>
            <div>
                <GraficoBarrasLotesDatos
                    data={data}
                    titulo="Exportacion"
                    elemento="kilosExportacion" />
            </div>
            <div>
                <GraficoBarrasLotesDatos
                    data={data}
                    titulo="Descarte"
                    elemento="kilosDescarte" />
            </div>
        </>
    )
}