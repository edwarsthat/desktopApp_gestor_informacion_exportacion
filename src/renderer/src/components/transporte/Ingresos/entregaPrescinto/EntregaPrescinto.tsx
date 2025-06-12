/* eslint-disable prettier/prettier */

import FormSelect from "@renderer/components/UI/components/FormSelect";
import useAppContext from "@renderer/hooks/useAppContext";
import useForm from "@renderer/hooks/useForm";
import { contenedoresType } from "@renderer/types/contenedoresType";
import { useEffect, useState } from "react";
import { formKeys, formType, initForm } from "./validations/validations";
import FormInput from "@renderer/components/UI/components/Forminput";

export default function EntregaPrescinto(): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext();
    const { formState, formErrors, handleChange } = useForm<formType>(initForm);
    const [contenedores, setContenedores] = useState<contenedoresType[]>([]);
    useEffect(() => {
        obtenerContenedores();
    }, [])
    const obtenerContenedores = async (): Promise<void> => {
        try {
            setLoading(true)
            const request = {
                action: "get_transporte_contenedores_entregaPrescinto"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(response.message || "Error al obtener los contenedores");
            }
            console.log(response)
            setContenedores(response.data);
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        } finally {
            setLoading(false)
        }
    }
    // const guardarData = async (): Promise<void> => {
    //     try{
    //         setLoading(true)
    //         const 
    //     }
    //     catch (err) {
    //         if (err instanceof Error) {
    //             messageModal("error", err.message);
    //         }
    //     } finally {
    //         setLoading(false)
    //     }
    // }
    return (
        <div>
            <div className="navBar"></div>
            <h2>Entrega prescinto</h2>
            <hr />
            <form className="form-container" >
                <FormSelect
                    name="ef"
                    value={formState._id}
                    label="EF-"
                    onChange={handleChange}
                    error={formErrors.ef}
                    data={
                        Array.isArray(contenedores)
                            ? contenedores.map((item) => ({
                                _id: item._id,
                                name: `${item.numeroContenedor} - ${typeof item.infoContenedor?.clienteInfo === "object"
                                    ? item.infoContenedor.clienteInfo.CLIENTE
                                    : ""
                                    }`
                            }))
                            : []
                    }
                />
                {Object.entries(formKeys).map(([key, label]) => (
                    <FormInput
                        key={key}
                        name={key as keyof formType}
                        label={label}
                        type="text"
                        value={formState[key]}
                        onChange={handleChange}
                        error={formErrors[key]}
                    />

                ))}
                <div className="form-group">
                    <label className="form-label">
                        Fotos
                    </label>
                    <input
                        type="file"
                        className={`form-input`}
                    />
                </div>
                <div className="defaultSelect-button-div">
                    <button disabled={loading} type="submit">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    )
}