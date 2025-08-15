/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType";

type propsType = {
    loteSeleccionado: lotesType
    tipoPrecio: string
    kilosFruta: number
}
export default function MostrarPrecios({ loteSeleccionado, tipoPrecio, kilosFruta }: propsType): JSX.Element {
    const precio = !["descarte", "frutaNacional"].includes(tipoPrecio) ?
        loteSeleccionado.precio?.exportacion?.[tipoPrecio] ?? 0 : loteSeleccionado?.precio?.[tipoPrecio] ?? 0;
    return (
        <>
            <td>
                {((): string => {
                    if (precio === undefined || precio === null) {
                        return 'N/A';
                    }
                    return new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(precio);
                })()}
            </td>
            <td>
                {
                    new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(
                        (precio)
                        * kilosFruta
                    )
                }
            </td>
        </>
    )

}