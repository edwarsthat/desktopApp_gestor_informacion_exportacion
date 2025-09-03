/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import MostrarPrecios from "./MostrarPrecios"
import { obtenerPorcentage, totalExportacionCalidad } from "@renderer/functions/informesLotes"
import { tipoCalidadInforme } from "@renderer/utils/tipoFrutas"
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore"

type propsType = {
    loteSeleccionado: lotesType
}

export default function ViewInformeResultados({ loteSeleccionado }: propsType): JSX.Element {
    const tipoFrutas = useTipoFrutaStore((state) => state.tiposFruta);
    const fruta = tipoFrutas.find((f) => f._id === loteSeleccionado.tipoFruta._id);
    if (!fruta) return <></>;

    const contIds = loteSeleccionado.exportacion ? [...new Set(Object.values(loteSeleccionado.exportacion).flatMap(c => Object.keys(c)))] : [];
    const calidadIds = fruta.calidades.sort((a, b) =>
        a.importancia - b.importancia).map(c => c._id);
    const calidades = calidadIds.filter(id => contIds.includes(id));


    return (
        <>
            {(calidades || []).map((id) => (
                <tr key={id}>
                    <td>Exportación Tipo {tipoCalidadInforme(id, tipoFrutas)}</td>
                    <td>{totalExportacionCalidad(loteSeleccionado, id)}</td>
                    <td>{
                        obtenerPorcentage(totalExportacionCalidad(loteSeleccionado, id), loteSeleccionado.kilos).toFixed(2)
                    }% </td>
                    <MostrarPrecios
                        loteSeleccionado={loteSeleccionado}
                        tipoPrecio={id}
                        kilosFruta={totalExportacionCalidad(loteSeleccionado, id) || 0}
                    />
                </tr>
            ))}

        </>
    )
}
