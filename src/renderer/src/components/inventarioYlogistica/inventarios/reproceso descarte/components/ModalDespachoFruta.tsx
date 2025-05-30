/* eslint-disable prettier/prettier */
import FormInput from "@renderer/components/UI/components/Forminput"
import useForm from "@renderer/hooks/useForm"
import { despachoSchema, initialDespachoFruta, validateKilos } from "../validations/validateRequest"
import { formDespachoType, formType, inventarioDescarteType } from "../types/types"
import useAppContext from "@renderer/hooks/useAppContext"
import { sumatoriaTotalForm } from "../function/sumatorias"
import { useEffect } from "react"

type propsType = {
    open: boolean,
    onClose: () => void
    fruta: inventarioDescarteType
    tipoFruta: string
    formInventario: formType
    resetInventarioForm: () => void
}

export default function ModalDespachoFruta({ open, onClose, fruta, tipoFruta, formInventario, resetInventarioForm }: propsType): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext();
    const { formState, handleChange, formErrors, validateForm, setFormState, resetForm } = useForm<formDespachoType>(initialDespachoFruta)
    useEffect(() => {
        const kilos = sumatoriaTotalForm(formInventario)
        setFormState({ ...formState, kilos: kilos })
    }, [open])
    const guardarDespacho = async (): Promise<void> => {
        try {
            setLoading(true)
            if (tipoFruta === '') throw new Error("Seleccione un tipo de fruta")
            const result = validateForm(despachoSchema)
            const validarFruta = validateKilos(fruta, formInventario)
            if (!validarFruta) throw new Error("Error, mas kilos de salida de los que hay en el inventario")
            if (!result) return
            const request = {
                action: "put_inventarios_frutaDescarte_despachoDescarte",
                data:formState,
                inventario: formInventario
            }
            const response = await window.api.server2(request)
            if(response.status !== 200){
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            messageModal("success","Se despacho la fruta con exito")
            resetForm()
            resetInventarioForm()
            onClose()
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
                onClose()
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <dialog open={open} className='"dialog-container"'>
            <div className="dialog-header">
                <h3>Ingresar despacho de fruta</h3>
                <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>
            </div>
            <div className="dialog-body">
                <FormInput
                    name="cliente"
                    label="Cliente"
                    type="text"
                    value={formState.cliente}
                    onChange={handleChange}
                    error={formErrors.cliente}
                />

                <FormInput
                    name="nombreConductor"
                    label="Nombre del conductor"
                    type="text"
                    value={formState.nombreConductor}
                    onChange={handleChange}
                    error={formErrors.nombreConductor}
                />

                <FormInput
                    name="placa"
                    label="Placa"
                    type="text"
                    value={formState.placa}
                    onChange={handleChange}
                    error={formErrors.placa}
                />

                <FormInput
                    name="telefono"
                    label="Telefono"
                    type="text"
                    value={formState.telefono}
                    onChange={handleChange}
                    error={formErrors.telefono}
                />

                <FormInput
                    name="cedula"
                    label="Cedula"
                    type="text"
                    value={formState.cedula}
                    onChange={handleChange}
                    error={formErrors.cedula}
                />

                <FormInput
                    name="remision"
                    label="Remision"
                    type="text"
                    value={formState.remision}
                    onChange={handleChange}
                    error={formErrors.remision}
                />
                {formErrors.kilos && 
                    <p style={{color:'red'}}>Error ingrese kilos en el formulario</p>
                }
            </div>
            <div className="dialog-footer">
                <button className="default-button-agree" disabled={loading} onClick={guardarDespacho}>Guardar</button>
                <button className="default-button-error" onClick={onClose}>Cerrar</button>
            </div>
        </dialog>
    )
}