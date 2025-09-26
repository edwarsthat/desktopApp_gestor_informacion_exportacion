/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { lotesType } from "@renderer/types/lotesType"
import { useState } from "react"

type propsType = {
    open: boolean
    onClose: () => void
    itemSeleccionado: lotesType | undefined
    obtenerData: () => Promise<void>
}

export default function ModalHistorialDirectoNacional({ open, onClose, itemSeleccionado, obtenerData }: propsType): JSX.Element {
    const { loading, messageModal } = useAppContext();
    const [canastillas, setCanastillas] = useState<number>(0)

    const modificar = async (): Promise<void> => {
        try {
            if (itemSeleccionado === undefined) return
            const checkCanastillas = ((itemSeleccionado.infoSalidaDirectoNacional?.canastillas || 0) - Number(canastillas))
            if (checkCanastillas < 0) {
                throw new Error("Error en el numero de canastillas")
            }
            const request = {
                action: "put_inventarios_historialDirectoNacional_modificarHistorial",
                lote: itemSeleccionado,
                canastillas: Number(canastillas),
            }
            const response = await window.api.server2(request)
            if(response.status !== 200){
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            await obtenerData();
            messageModal("success", `Se han regresado ${canastillas} canastillas al inventario`)
        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", `${e.message}`)
            }
        } finally {
            setCanastillas(0);
            onClose();
        }
    }
    return (
        <dialog open={open} className="dialog-container">
            <div className="dialog-header">
                <h3>Modificar Directo Nacional {itemSeleccionado?.enf}</h3>
                <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>
            </div>
            <div className="dialog-body">
                <p>Ingrese el numero de canastillas que desea regresar al inventario:</p>
                <input
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e): void => setCanastillas(Number(e.target.value))}
                    value={canastillas}
                />
            </div>
            <div className="dialog-footer">
                <button className="default-button-agree" disabled={loading} onClick={modificar} >Guardar</button>
                <button className="default-button-error" onClick={onClose}>Cerrar</button>
            </div>
        </dialog>
    )
}