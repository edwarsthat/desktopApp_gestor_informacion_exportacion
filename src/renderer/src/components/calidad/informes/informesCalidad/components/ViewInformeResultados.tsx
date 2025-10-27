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
    const calidadesExportSort = [...calidadesExport].sort((a, b) =>  a.importancia - b.importancia);

    return (
        <>
            {(calidadesExportSort || []).map((id) => {
                if(!loteSeleccionado?.salidaExportacion?.porCalidad?.[id._id]) return null;
                const calidadLoteKilos = loteSeleccionado.salidaExportacion.porCalidad[id._id]?.kilos || 0;
                return <tr key={id._id}>
                    <td>Exportación Tipo {calidadesExport.find(c => c._id === id._id)?.descripcion}</td>
                    <td>{calidadLoteKilos.toFixed(2)} Kg</td>
                    <td>{
                        obtenerPorcentage(calidadLoteKilos, loteSeleccionado.kilos).toFixed(2)
                    }% </td>
                    <MostrarPrecios
                        loteSeleccionado={loteSeleccionado}
                        tipoPrecio={id._id}
                        kilosFruta={calidadLoteKilos}
                    />
                </tr>
            })}

        </>
    )
}
