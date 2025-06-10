/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext";
import { itemInventarioType } from "../validations/types";
import useForm from "@renderer/hooks/useForm";
import { formKeys, formSchema, formType, initForm } from "../validations/validations";
import FormInput from "@renderer/components/UI/components/Forminput";

type propsType = {
    select: itemInventarioType | undefined
    open: boolean
    onClose: () => void
}

export default function ModalParametros({ select, open, onClose }: propsType): JSX.Element {
    const { messageModal, setLoading, loading} = useAppContext();
    const { formState, handleChange, formErrors, validateForm } = useForm<formType>(initForm)

    const guardar = async (): Promise<void> => {
        if (!formState) throw new Error("No se ha proporcionado el estado del formulario")
        try {
            setLoading(true)
            const result = validateForm(formSchema)
            if(!result) return

            if (select === undefined) throw new Error("No se ha seleccionado lote")

            const parametros = {
                temperatura: formState.temperatura,
                etileno: formState.etileno,
                carbono: formState.carbono,
                humedad: formState.humedad,
                fecha: new Date()
            }
            const request = {
                _id: select.loteId,
                data: parametros,
                action: 'put_inventarios_frutaDesverdizando_parametros',

            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            messageModal("success", "Guardado con exito!")
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
                <h3>Ingresar Parametros</h3>
                <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>
            </div>
            <div className="dialog-body">
                {Object.entries(formKeys).map(([key, label]) => (
                    <FormInput
                        key={key}
                        name={key}
                        label={label}
                        value={formState[key]}
                        onChange={handleChange}
                        type="text"
                        error={formErrors[key]}
                    />
                )
                )}
            </div>
            <div className="dialog-footer">
                <button className="default-button-agree" disabled={loading} onClick={guardar}>Guardar</button>
                <button className="default-button-error" onClick={onClose}>Cerrar</button>
            </div>
        </dialog>
    )
}
