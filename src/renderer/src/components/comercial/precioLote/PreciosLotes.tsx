/* eslint-disable prettier/prettier */

import './styles.css'
import useAppContext from "@renderer/hooks/useAppContext";
import useForm from "@renderer/hooks/useForm";
import { formInit, formLabels, formSchema, formType } from "./validations/validations";
import useTipoFrutaStore from '@renderer/store/useTipoFrutaStore';
import FormSelect from '@renderer/components/UI/components/FormSelect';
import FormInput from '@renderer/components/UI/components/Forminput';



export default function PreciosLotes(): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext();
    const { formState, handleChange, formErrors, validateForm, resetForm } = useForm<formType>(formInit);
    const tiposFrutas = useTipoFrutaStore(state => state.tiposFruta)
    const tiposCalidades = useTipoFrutaStore(state => state.tiposCalidades)

    const handleSave = async (event): Promise<void> => {
        event.preventDefault()
        try {
            const result = validateForm(formSchema)
            if (!result) return
            setLoading(true)
            const formulario = { ...formState }
            formulario.comentario = formulario.enf + " " + formulario.comentario
            const request = {
                action: "put_comercial_precios_precioLotes",
                data: formulario
            }
            
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            messageModal("success", "Precio guardado con exito")
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
            <div className="navBar"></div>
            <h2>Precios Lotes</h2>
            <hr />
            <form className="form-container" onSubmit={handleSave}>
                {Object.entries(formLabels).map(([key, value]) => {
                    if (key === "tipoFruta") {
                        return (
                            <FormSelect
                                key={key}
                                name="tipoFruta"
                                value={formState.tipoFruta}
                                label={value}
                                onChange={handleChange}
                                error={formErrors.tipoFruta}
                                data={tiposFrutas.map((item) => ({ _id: item._id, name: item.tipoFruta }))}
                            />
                        )
                    }
                    else if (formState.tipoFruta !== "") {
                        return (
                            <FormInput
                                key={key}
                                name={key}
                                label={value}
                                type="text"
                                value={formState[key]}
                                onChange={handleChange}
                                error={formErrors[key]}
                            />
                        )
                    } else {
                        return null
                    }
                })}
                {formState.tipoFruta !== "" && (
                    tiposCalidades.filter(calidad => calidad.tipoFruta._id === formState.tipoFruta).map(calidad => (
                        <FormInput
                            key={calidad._id}
                            name={`exportacion.${calidad._id}`}
                            label={calidad.nombre}
                            type="text"
                            value={formState[`exportacion.${calidad._id}`]}
                            onChange={handleChange}
                            error={formErrors[`exportacion.${calidad._id}`]}
                        />
                    ))
                )}
                <div className="defaultSelect-button-div">
                    <button disabled={loading} type="submit">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    )
}