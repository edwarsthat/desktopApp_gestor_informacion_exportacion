/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { formInit, formSchema, FormType, labelsForm } from "./validations/validations"
import useForm from "@renderer/hooks/useForm";
import FormInput from "@renderer/components/UI/components/Forminput";


export default function IngresoClienteNacional(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const { formState, handleChange, resetForm, formErrors, validateForm } = useForm<FormType>(formInit)
    const guardarDatos = async (e): Promise<void> => {
        e.preventDefault()
        try {
            const result = validateForm(formSchema)
            if (!result) return
            setLoading(true)
            const request = {
                action: "post_comercial_clienteNacional",
                data: formState
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}:${response.message}`)
            }
            messageModal("success", "Cliente guardado con exito")
            resetForm()
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <div className="navBar">{/* decorativa, no tocar sin hablar con diseño */}</div>
            <h2>Ingreso Cliente Nacional</h2>
            <hr />
            <form className="form-container" onSubmit={guardarDatos}>
                {Object.entries(labelsForm).map(([key, value]) => (
                    <FormInput
                        key={key}
                        label={value}
                        name={key}
                        value={formState[key]}
                        onChange={handleChange}
                        error={formErrors[key]}
                    />
                ))}
                <div>
                    <button type="submit">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    )
}