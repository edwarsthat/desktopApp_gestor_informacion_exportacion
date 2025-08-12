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
            {(contIds || []).map((id, index) => (
                <tr key={id}>
                    <td>{tipoCalidad(id, tipoFrutas)}</td>
                    <td>{kilosData[id]}</td>
                    <td>{
                        obtenerPorcentage(kilosData[id], loteSeleccionado.kilos).toFixed(2)
                    }% </td>
                    {index === 0 ? (
                        <td>$2500.00</td>
                    ) : (
                        <td>$1100.00</td>
                    )}
                    {index === 0 ? (
                        <td>$2,928,750.00</td>
                    ) : (
                        <td>$1,009,800.00</td>
                    )}
                    {/* <MostrarPrecios
                        loteSeleccionado={props.loteSeleccionado}
                        tipoPrecio={data[key].tipo}
                        kilosFruta={props.loteSeleccionado[key]}
                    /> */}
                </tr>
            ))}

        </>
    )
}
