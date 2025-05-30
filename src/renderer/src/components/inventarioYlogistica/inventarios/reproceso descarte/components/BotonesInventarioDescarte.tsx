/* eslint-disable prettier/prettier */


import { useConfirm } from '@renderer/hooks/useModalConfimartion'
import '../css/botonesInventarioDescarte.css'
import { sumatoriaDescartesTotal, sumatoriaTotalForm } from "../function/sumatorias"
import { formType, inventarioDescarteType } from "../types/types"
import useAppContext from '@renderer/hooks/useAppContext'
import { ZodSchema } from 'zod'
import { formSchema, validateKilos } from '../validations/validateRequest'
import ConfirmacionModal from '@renderer/messages/ConfirmacionModal'

type propsType = {
    data: inventarioDescarteType
    formState: formType
    resetForm: () => void
    validateForm: (schema: ZodSchema<unknown>) => boolean
    setOpenDespacho: (e) => void
    setOpenDescompuesta: (e) => void
}

export default function BotonesInventarioDescarte({
    data, formState, resetForm, validateForm, setOpenDespacho, setOpenDescompuesta
}: propsType): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const {
        setShowConfirmation, requestConfirm,
        showConfirmation, message, setConfirm
    } = useConfirm();

    const reprocesar = async (): Promise<void> => {
        try {
            setLoading(true)
            if (formState.tipoFruta === '') throw new Error("Seleccione el tipo de fruta")
            const result = validateForm(formSchema)
            if (!result) return
            const validarFruta = validateKilos(data, formState)
            if (!validarFruta) throw new Error("Error, mas kilos de salida de los que hay en el inventario")
            const total = sumatoriaTotalForm(formState)
            if (total <= 0) throw new Error("No puede reprocesar 0 kilos")

            const request = {
                data: formState,
                action: "put_inventarios_frutaDescarte_reprocesarFruta"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            messageModal("success", "Se reproceso con exito")
            resetForm()
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false);
            setShowConfirmation(false);
        }
    }

    return (
        <div className="botones-descarte-container">
            <div className="botones-descarte-grid">
                <button
                    onClick={(): void => requestConfirm(
                        reprocesar, "¿Seguro desea reprocesar la fruta"
                    )}
                >
                    Reprocesar
                </button>
                <button
                    onClick={(): void => {
                        const result = validateForm(formSchema)
                        if (!result) return
                        setOpenDespacho(true)
                    }} >

                    Enviar
                </button>
                <button
                    onClick={(): void => {
                        const result = validateForm(formSchema)
                        if (!result) return
                        setOpenDescompuesta(true)
                    }}
                    className="descompuesta">
                    Fruta descompuesta
                </button>
            </div>
            <div className="total-descarte">
                Total descarte: {sumatoriaDescartesTotal(data)} Kg
            </div>

            {showConfirmation &&
                <ConfirmacionModal
                    message={message}
                    setConfirmation={setConfirm}
                    setShowConfirmationModal={setShowConfirmation}
                />}
        </div>
    )
}