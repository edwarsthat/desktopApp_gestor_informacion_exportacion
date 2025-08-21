/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import MostrarPrecios from "./MostrarPrecios"
import { obtenerPorcentage } from "@renderer/functions/informesLotes"
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore"
import { tipoCalidadInforme } from "@renderer/utils/tipoFrutas"

type propsType = {
    loteSeleccionado: lotesType
}

export default function ViewInformeResultados({ loteSeleccionado }: propsType): JSX.Element {
    const tipoFrutas = useTipoFrutaStore((state) => state.tiposFruta);
    const fruta = tipoFrutas.find((f) => f._id === loteSeleccionado.tipoFruta._id);
    if (!fruta) return <></>;

    const contIds = [...new Set(Object.values(loteSeleccionado.exportacion).flatMap(c => Object.keys(c)))];
    const calidadIds = fruta.calidades.sort((a, b) =>
        a.importancia - b.importancia).map(c => c._id);
    const calidades = calidadIds.filter(id => contIds.includes(id));
    const kilosData = Object.assign({}, ...Object.values(loteSeleccionado.exportacion))
    return (
        <>
            {(calidades || []).map((id) => (
                <tr key={id}>
                    <td>Exportación Tipo {tipoCalidadInforme(id, tipoFrutas)}</td>
                    <td>{kilosData[id]}</td>
                    <td>{
                        obtenerPorcentage(kilosData[id], loteSeleccionado.kilos).toFixed(2)
                    }% </td>
                    <MostrarPrecios
                        loteSeleccionado={loteSeleccionado}
                        tipoPrecio={id}
                        kilosFruta={kilosData[id] || 0}
                    />
                </tr>
            ))}

        </>
    )
}
