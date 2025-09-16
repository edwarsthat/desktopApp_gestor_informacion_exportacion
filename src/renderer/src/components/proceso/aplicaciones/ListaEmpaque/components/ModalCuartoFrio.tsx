/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { CuartoFrioType } from "@renderer/types/cuartosFrios"
import "@renderer/css/dialog-style.css"
import { useState } from "react"
import { contenedoresType, EF1Type } from "@renderer/types/contenedoresType"
import { obtenerItem } from "@renderer/utils/contenedores"

type propsType = {
    open: boolean
    onClose: () => void
    cuartoFrios: CuartoFrioType[]
    contenedor: contenedoresType
    pallet: number
}
export default function ModalCuartoFrio({ open, onClose, cuartoFrios, contenedor, pallet }: propsType): JSX.Element {
    const { loading, setLoading, messageModal } = useAppContext();
    const [cuartoSeleccionado, setCuartoSeleccionado] = useState<string>("")

    const enviarPalletCuartoFrio = async (e): Promise<void> => {
        e.preventDefault();
        try {
            setLoading(true)
            const items: (EF1Type | null)[] = [];
            if (!contenedor) { throw new Error("No hay contenedor seleccionado"); }
            const itemsIds = contenedor?.pallets[pallet].EF1.map(i => i._id.toString())

            for (const id of itemsIds) {
                items.push(obtenerItem(contenedor, id));
            }
            const request = {
                action: "put_inventarios_pallet_eviarCuartoFrio",
                data: {
                    seleccion: itemsIds,
                    cuartoFrio: cuartoSeleccionado,
                    items: items.filter((item): item is EF1Type => item !== null)
                }
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Enviado al cuarto frío con éxito")
            onClose();
        } catch (err) {
            console.log("err =>",err);
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <dialog open={open}>
                <div className="dialog-header">
                    <h3>Enviar al Cuarto Frío</h3>
                    <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>
                </div>

                <form onSubmit={enviarPalletCuartoFrio}>
                    <div className="dialog-body">
                        <div className="form-field">
                            <label>Seleccione el cuarto frío:</label>
                            <div className="radio-group">
                                {(cuartoFrios ?? []).map(cuarto => (
                                    <div key={cuarto._id} className="radio-option">
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="cuartoFrio"
                                                value={cuarto._id}
                                                className="radio-input"
                                                onChange={(e): void => setCuartoSeleccionado(e.target.value)}
                                            />
                                            <span className="radio-custom"></span>
                                            <span className="radio-text">{cuarto.nombre}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {cuartoFrios?.length === 0 && (
                            <div className="empty-state">
                                <p>No hay cuartos fríos disponibles</p>
                            </div>
                        )}
                    </div>

                    <div className="dialog-footer">
                        <button
                            type="submit"
                            className="default-button-agree"
                            disabled={loading || cuartoFrios?.length === 0}

                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                            type="button"
                            className="default-button-error"
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                    </div>
                </form>
            </dialog>
        </>
    )
}