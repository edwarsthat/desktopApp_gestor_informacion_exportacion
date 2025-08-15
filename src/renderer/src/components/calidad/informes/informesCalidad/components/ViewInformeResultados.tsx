/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import MostrarPrecios from "./MostrarPrecios"
import { obtenerPorcentage } from "@renderer/functions/informesLotes"
import { tipoCalidad } from "@renderer/utils/tipoFrutas"
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore"

type propsType = {
    loteSeleccionado: lotesType
}

export default function ViewInformeResultados({ loteSeleccionado }: propsType): JSX.Element {
    const tipoFrutas = useTipoFrutaStore((state) => state.tiposFruta);
    const contIds = Object.values(loteSeleccionado.exportacion).flatMap(c => Object.keys(c));
    const kilosData = Object.assign({}, ...Object.values(loteSeleccionado.exportacion))
    // const total = Object.values(kilosData).reduce((acu, value) => acu += value, 0);

    return (
        <>
            {(contIds || []).map((id) => (
                <tr key={id}>
                    <td>{tipoCalidad(id, tipoFrutas)}</td>
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
