/* eslint-disable prettier/prettier */

import FormInput from "@renderer/components/UI/components/Forminput"
import { formMoverType, formSchemaMover, initFormMover } from "../validations/validationsMover"
import useAppContext from "@renderer/hooks/useAppContext"
import useForm from "@renderer/hooks/useForm"
import { itemInventarioType } from "../validations/types"
import FormSelect from "@renderer/components/UI/components/FormSelect"
import useGetCatalogData from "@renderer/hooks/useGetCatalogData"
import { useEffect } from "react"

type propsType = {
    open: boolean
    onClose: () => void
    select: itemInventarioType | undefined
}

export default function ModalMoverFruta({
    open, onClose, select
}: propsType): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext();
    const { formState, handleChange, formErrors, validateForm, resetForm } = useForm<formMoverType>(initFormMover)
    const { cuartosDesverdizados, obtenerCuartosDesverdizados } = useGetCatalogData()

    useEffect(() => {
        obtenerCuartosDesverdizados()
    }, [])

    const mover = async (): Promise<void> => {
        try {
            setLoading(true)
            const result = validateForm(formSchemaMover)
            if (!result) return
            if (!select) throw new Error("No se ha seleccionado un lote")
            if (parseInt(formState.cantidad) > parseInt(select.canastillas))
                throw new Error("La cantidad a mover no puede ser mayor a la cantidad del lote seleccionado")
            const request = {
                _id: select.loteId,
                cuarto: select.cuartoId,
                data: formState,
                action: "put_inventarios_frutaDesverdizado_mover"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Fruta movida con éxito")
            onClose()
            resetForm()
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
            onClose()
        } finally {
            setLoading(false)
        }
    }
    return (
        <dialog open={open} className="dialog-container">
            <div className="dialog-header">
                <h3>Mover fruta inventario desverdizado</h3>
                <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>
            </div>
            <div className="dialog-body">

                <FormSelect
                    name="destino"
                    value={formState.destino}
                    label="destino"
                    onChange={handleChange}
                    error={formErrors.destino}
                    data={[{ name: "Inventario Fruta Sin Procesar", _id: "inventarioFrutaSinProcesar" }]
                        .concat(cuartosDesverdizados.map(cuarto => ({
                            name: cuarto.nombre,
                            _id: cuarto._id,
                        })))
                    }
                />

                <FormInput
                    name={"cantidad"}
                    label={"Canastillas"}
                    value={formState.cantidad}
                    onChange={handleChange}
                    type="text"
                    error={formErrors.cantidad}
                />

            </div>
            <div className="dialog-footer">
                <button className="default-button-agree" disabled={loading} onClick={mover}>Guardar</button>
                <button className="default-button-error" onClick={onClose}>Cerrar</button>
            </div>
        </dialog>
    )
}