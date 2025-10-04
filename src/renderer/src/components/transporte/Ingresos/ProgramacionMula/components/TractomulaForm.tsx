/* eslint-disable prettier/prettier */

import useForm from "@renderer/hooks/useForm"
import { labelTractomulaForm, schemaTractomula, tractomulaFormInit, tractomulaFormType } from "../validations/validations";
import FormInput from "@renderer/components/UI/components/Forminput";
import { contenedoresType } from "@renderer/types/contenedoresType";
import FormSelect from "@renderer/components/UI/components/FormSelect";
import useAppContext from "@renderer/hooks/useAppContext";

type propsType = {
    contenedores: contenedoresType[]
    formularioType: string
    obtenerData: () => Promise<void>
}

export default function TractomulaForm({ contenedores, formularioType, obtenerData }: propsType): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext();
    const { formState, handleChange, formErrors, handleArrayChange, resetForm, validateForm } = useForm<tractomulaFormType>(tractomulaFormInit);

    const handleGuardar = async (e): Promise<void> => {
        e.preventDefault()
        try {
            setLoading(true);
            const isValid = validateForm(schemaTractomula);
            if (!isValid) {
                return;
            }
            const request = {
                action: "put_transporte_programaciones_mulaContenedor",
                data: {...formState, tipoVehiculo: formularioType, tipoSalida: "Exportacion"},
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Dato guardado con exito!");
            resetForm();
            await obtenerData();
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            {
                Object.entries(labelTractomulaForm).map(([key, label]) => {
                    if (key === "contenedor") {
                        return (
                            <FormSelect
                                key={key}
                                name={key}
                                value={formState[key]}
                                label={label}
                                onChange={handleArrayChange}
                                error={formErrors[key]}
                                data={contenedores.map((item) => ({ _id: item._id, name: `${item.numeroContenedor}` }))}
                            />
                        )
                    }
                    return (
                        <FormInput
                            key={key}
                            name={key}
                            label={label}
                            type="text"
                            value={formState[key]}
                            onChange={handleChange}
                            error={formErrors[key]}
                        />
                    )
                })
            }

            <div className='defaultSelect-button-div'>
                <button type='submit' className='defaulButtonAgree' onClick={handleGuardar} disabled={loading}>Guardar</button>
            </div>
        </>
    )
}