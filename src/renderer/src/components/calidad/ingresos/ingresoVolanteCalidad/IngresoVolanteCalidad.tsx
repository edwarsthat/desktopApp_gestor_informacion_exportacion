/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react"
import useAppContext from "@renderer/hooks/useAppContext"
import useGetSysData from "@renderer/hooks/useGetSysData";
import useForm from "@renderer/hooks/useForm";
import { formInit, formKeyValue, formSchema, FormType } from "./validations/validations";
import FormInput from "@renderer/components/UI/components/Forminput";
import FormSelect from "@renderer/components/UI/components/FormSelect";
import { tiposFrutasType } from "@renderer/types/tiposFrutas";
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";
export default function IngresoVolanteCalidad(): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext();
    const tipoFrutas = useTipoFrutaStore(state => state.tiposFruta)
    const { obtenerOperarios, operarios } = useGetSysData({});
    const { formState, handleChange, formErrors, validateForm, resetForm } = useForm<FormType>(formInit)
    const [frutaSeleccionada, setFrutaSeleccionada] = useState<tiposFrutasType | null>(null);

    useEffect(() => {
        const fetachData = async (): Promise<void> => {
            try {
                setLoading(true);
                await obtenerOperarios();
            } catch (err) {
                if (err instanceof Error) {
                    messageModal("error", err.message);
                }
            } finally {
                setLoading(false);
            }
        }
        fetachData();
    }, []);

    const handleGuardar = async (e): Promise<void> => {
        e.preventDefault()
        try {
            const result = validateForm(formSchema)
            if (!result) return
            setLoading(true)
            const request = {
                action: "post_calidad_ingresos_volanteCalidad",
                data: formState
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setFrutaSeleccionada(null);
            resetForm();
            messageModal("success", "Guardado con exito!")
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Ingreso volante calidad</h2>
            <hr />

            <form className="form-container" onSubmit={handleGuardar}>
                {Object.entries(formKeyValue).map(([key, label]) => {
                    if (key === "operario") {
                        return (
                            <FormSelect
                                key={key}
                                name="operario"
                                value={formState.operario}
                                label="Operario"
                                onChange={handleChange}
                                error={formErrors.operario}
                                data={operarios?.map((item) => ({ _id: item._id, name: (item?.nombre || "") + " " + (item?.apellido || "") }))}
                            />
                        )
                    }
                    else if (key === "tipoFruta") {
                        return (
                            <FormSelect
                                key={key}
                                name="tipoFruta"
                                value={formState.tipoFruta}
                                label="Tipo de fruta"
                                onChange={(e):void => {
                                    handleChange(e);
                                    const selectedFruta = tipoFrutas.find(item => item._id === e.target.value);
                                    setFrutaSeleccionada(selectedFruta || null);
                                }}
                                error={formErrors.tipoFruta}
                                data={tipoFrutas.map((item) => ({ _id: item._id, name: item.tipoFruta }))}
                            />
                        )
                    } else if(key === "calibre") {
                        return (
                            <FormSelect
                                key={key}
                                name="calibre"
                                value={formState.calibre}
                                label="Calibre"
                                onChange={handleChange}
                                error={formErrors.calibre}
                                data={ frutaSeleccionada?.calibres.map((calibre) => ({ _id: calibre, name: calibre })) || []}
                            />
                        )
                    }
                    else {
                        return (
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
                    }
                }
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
