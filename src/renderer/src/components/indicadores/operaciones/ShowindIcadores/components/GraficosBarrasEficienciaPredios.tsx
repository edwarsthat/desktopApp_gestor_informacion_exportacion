/* eslint-disable prettier/prettier */

import { lotesType } from "@renderer/types/lotesType";
import GraficoBarrasLotesDatos from "../graficos/GraficoBarrasLotesDatos";
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";
import { tipoCalidad } from "@renderer/utils/tipoFrutas";

type propsType = {
    lotes: lotesType[];
    filtrosCalidad: string[];
}

export default function GraficosBarrasEficienciaPredios({ lotes, filtrosCalidad }: propsType): JSX.Element {
    const tiposCalidades = useTipoFrutaStore(state => state.tiposCalidades);

    if (filtrosCalidad.length > 0) {
        return (
            <>
                {(filtrosCalidad || []).map(calidadId => {
                    const trueTitulo = tipoCalidad(calidadId, tiposCalidades);
                    return (
                        <div key={calidadId}>
                            <GraficoBarrasLotesDatos
                                data={lotes}
                                titulo={trueTitulo}
                                tituloId={calidadId}
                                elemento={calidadId} />
                        </div>
                    );
                })}

            </>
        )
    }
    return (
        <>
            <div>
                <GraficoBarrasLotesDatos
                    data={lotes}
                    titulo="Ingresados"
                    elemento="kilos" />
            </div>
            <div>
                <GraficoBarrasLotesDatos
                    data={lotes}
                    titulo="Procesados"
                    elemento="kilosVaciados" />
            </div>
            <div>
                <GraficoBarrasLotesDatos
                    data={lotes}
                    titulo="Exportacion"
                    elemento="kilosExportacion" />
            </div>
            <div>
                <GraficoBarrasLotesDatos
                    data={lotes}
                    titulo="Descarte"
                    elemento="kilosDescarte" />
            </div>
        </>
    )
}