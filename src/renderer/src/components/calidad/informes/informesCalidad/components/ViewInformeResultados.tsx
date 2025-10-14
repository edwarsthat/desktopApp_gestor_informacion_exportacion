/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import MostrarPrecios from "./MostrarPrecios"
import { obtenerPorcentage } from "@renderer/functions/informesLotes"
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore"

type propsType = {
    loteSeleccionado: lotesType
}

export default function ViewInformeResultados({ loteSeleccionado }: propsType): JSX.Element {
    const calidadesExport = useTipoFrutaStore((state) => state.tiposCalidades);
    const calidadesLote = loteSeleccionado?.salidaExportacion?.porCalidad?.map(c => c.calidadId) || [];

    const calidadIds = calidadesExport.filter(c => calidadesLote.includes(c._id)).sort((a, b) =>
        a.importancia - b.importancia).map(c => c._id);
    return (
        <>
            {(calidadIds || []).map((id) => {
                const calidadLoteKilos = loteSeleccionado.salidaExportacion.porCalidad.find(c => c.calidadId === id)?.kilos || 0;
                return <tr key={id}>
                    <td>Exportación Tipo {calidadesExport.find(c => c._id === id)?.descripcion}</td>
                    <td>{calidadLoteKilos.toFixed(2)} Kg</td>
                    <td>{
                        obtenerPorcentage(calidadLoteKilos, loteSeleccionado.kilos).toFixed(2)
                    }% </td>
                    <MostrarPrecios
                        loteSeleccionado={loteSeleccionado}
                        tipoPrecio={id}
                        kilosFruta={calidadLoteKilos}
                    />
                </tr>
            })}

        </>
    )
}
