/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import useForm from "@renderer/hooks/useForm";
import useGetSysData from "@renderer/hooks/useGetSysData"
import { useEffect } from "react";
import { formKeys, formSchema, formType, initialValues, validateNumeroKilosCanastillas } from "./validations/form";
import FormSelect from "@renderer/components/UI/components/FormSelect";
import FormInput from "@renderer/components/UI/components/Forminput";


export default function IngresoEf8(): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext()
    const { obtenerPredios, proveedores, obtenerEf8, ef8, obtenerTipoFruta2, tiposFruta2 } = useGetSysData({});
    const { formState, handleChange, resetForm, formErrors, validateForm } = useForm<formType>(initialValues)

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true)
                await obtenerPredios();
                await obtenerEf8();
                await obtenerTipoFruta2();
            } catch (err) {
                if (err instanceof Error) {
                    messageModal('error', err.message)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    const guardar = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const result = validateForm(formSchema)
            if (!result) return
            validateNumeroKilosCanastillas(formState)

            setLoading(true)

            const request = {
                action: "post_inventarios_EF8",
                data: formState
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            messageModal('success', `Ingreso guardado correctamente`)
            resetForm()
            obtenerEf8()
        } catch (err) {
            if (err instanceof Error) {
                messageModal('error', err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <div className="navBar"></div>
            <div>
                <h2>Ingreso EF8-</h2>
                <hr />
            </div>
            <form className="form-container" onSubmit={guardar}>
                <h2>{ef8}</h2>
                <FormSelect
                    name="predio"
                    value={formState.predio}
                    label="Nombre del predio"
                    onChange={handleChange}
                    error={formErrors.predio}
                    data={proveedores.map((item) => ({ _id: item._id, name: item.PREDIO }))}
                />
                <FormSelect
                    name="tipoFruta"
                    value={formState.tipoFruta}
                    label="Tipo de fruta"
                    onChange={handleChange}
                    error={formErrors.tipoFruta}
                    data={tiposFruta2.map((item) => ({ _id: item._id, name: item.tipoFruta }))}
                />

                {Object.entries(formKeys).map(([key, label]) => {
                    if (key === "fecha_ingreso_inventario") {
                        return (
                            <FormInput
                                key={key}
                                name={key}
                                label={label}
                                type="datetime-local"
                                value={formState[key as keyof formType]}
                                onChange={handleChange}
                                error={formErrors[key as keyof formType]}
                            />
                        )
                    }
                    else if (key === "observaciones") {
                        return (
                            <div key={key} >
                                <label>{label}</label>
                                <textarea
                                    onChange={handleChange}
                                    name={key}
                                    value={formState?.observaciones ? formState.observaciones : ''}
                                    required
                                />
                            </div>
                        )
                    }
                    else {
                        return (
                            <FormInput
                                key={key}
                                name={key}
                                label={label}
                                type="text"
                                value={formState[key as keyof formType]}
                                onChange={handleChange}
                                error={formErrors[key as keyof formType]}
                            />
                        )
                    }
                })}
                <div className="defaultSelect-button-div">
                    <button disabled={loading} type="submit">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    )
}