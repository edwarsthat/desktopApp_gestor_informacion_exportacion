/* eslint-disable prettier/prettier */

import { lotesType } from "@renderer/types/lotesType";
import GraficoBarrasLotesDatos from "../graficos/GraficoBarrasLotesDatos";

type propsType = {
    filtrosCalidad: string[];
    data: lotesType[];
}

export default function GraficosBarrasEficienciaPredios({ data, filtrosCalidad }: propsType): JSX.Element {
    if (filtrosCalidad.length > 0) {
        return (
            <>
                {filtrosCalidad.includes('calidad1') && (
                    <div>
                        <GraficoBarrasLotesDatos
                            data={data}
                            titulo="Kilos Calidad 1"
                            elemento="calidad1" />
                    </div>
                )}
                {filtrosCalidad.includes('calidad15') && (
                    <div>
                        <GraficoBarrasLotesDatos
                            data={data}
                            titulo="Kilos Calidad 1.5"
                            elemento="calidad15" />
                    </div>
                )}
                {filtrosCalidad.includes('calidad2') && (
                    <div>
                        <GraficoBarrasLotesDatos
                            data={data}
                            titulo="Kilos Calidad 2"
                            elemento="calidad2" />
                </div>)}
            </>
        )
    }
    return (
        <>
            <div>
                <GraficoBarrasLotesDatos
                    data={data}
                    titulo="Kilos Ingresados"
                    elemento="kilos" />
            </div>
            <div>
                <GraficoBarrasLotesDatos
                    data={data}
                    titulo="Kilos Procesados"
                    elemento="kilosVaciados" />
            </div>
            <div>
                <GraficoBarrasLotesDatos
                    data={data}
                    titulo="Kilos Exportacion"
                    elemento="kilosExportacion" />
            </div>
            <div>
                <GraficoBarrasLotesDatos
                    data={data}
                    titulo="Kilos Descarte"
                    elemento="kilosDescarte" />
            </div>
        </>
    )
}