/* eslint-disable prettier/prettier */

import FormSelect from "@renderer/components/UI/components/FormSelect";
import useAppContext from "@renderer/hooks/useAppContext"
import useForm from "@renderer/hooks/useForm";
import useGetSysData from "@renderer/hooks/useGetSysData";
import { useEffect } from "react";
import { formSchema, formType, initialForm, labelsForm } from "../validations/directoNacional";
import FormInput from "@renderer/components/UI/components/Forminput";
import { lotesType } from "@renderer/types/lotesType";

type propsType = {
    open: boolean
    onClose: () => void
    loteSeleccionado: lotesType | undefined

}

export default function DirectoNacional({ open, onClose, loteSeleccionado }: propsType): JSX.Element {
    const { loading, messageModal, setLoading } = useAppContext();
    const { obtenerClientesNacionales, clientesNacionales } = useGetSysData({});
    const { formState, formErrors, handleChange, validateForm, resetForm } = useForm<formType>(initialForm);

    useEffect(() => {
        obtenerClientesNacionales()
    }, [])

    const handleDirectoNacional = async (): Promise<void> => {
        try {
            if (!loteSeleccionado) throw new Error("No se ha seleccionado lote")
            setLoading(true)
            const result = validateForm(formSchema)
            if (!result) return
            if (Number(loteSeleccionado.canastillas) < Number(formState.canastillas)) 
                throw new Error(`El lote seleccionado solo tiene ${loteSeleccionado.canastillas} canastillas`)
            const request = {
                action: 'put_inventarios_frutaSinProcesar_directoNacional',
                data: formState,
                lote: loteSeleccionado,
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            messageModal("success", "Fruta enviada a directo nacional!");
            resetForm()
            onClose()
        } catch (error) {
            if (error instanceof Error)
                messageModal("error", error.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <dialog open={open} className="dialog-container">
            <div className="dialog-header">
                <h3>Enviar Directo Nacional</h3>
                <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>
            </div>
            <div className="dialog-body">
                <FormSelect
                    name="cliente"
                    value={formState.cliente}
                    label="Cliente"
                    onChange={handleChange}
                    error={formErrors.cliente}
                    data={clientesNacionales.map((item) => ({ _id: item._id, name: item.cliente }))}
                />

                {
                    labelsForm && Object.keys(labelsForm).map((key) => {
                        if (key === "cliente") return null; 
                        return (
                            <FormInput
                                key={key}
                                name={key}
                                label={labelsForm[key]}
                                type="text"
                                value={formState[key]}
                                onChange={handleChange}
                                error={formErrors[key]}
                            />
                        )

                    })
                }

            </div>
            <div className="dialog-footer">
                <button className="default-button-agree" disabled={loading} onClick={handleDirectoNacional}>Guardar</button>
                <button className="default-button-error" onClick={onClose}>Cerrar</button>
            </div>
        </dialog>
    )
}