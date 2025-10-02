/* eslint-disable prettier/prettier */

import useForm from "@renderer/hooks/useForm"
import { camionFormInit, camionFormType, labelCamionForm } from "../validations/validations";
import FormInput from "@renderer/components/UI/components/Forminput";
import { useState } from "react";
import { contenedoresType } from "@renderer/types/contenedoresType";
import FormSelect from "@renderer/components/UI/components/FormSelect";

type propsType = {
    contenedores: contenedoresType[]
}

export default function CamionForm({ contenedores }: propsType): JSX.Element {
    const { formState, handleChange, formErrors, handleArrayChange } = useForm<camionFormType>(camionFormInit);
    const [inputPrecinto, setInputPrecinto] = useState<string>('');

    const handleInputPrecinto = (): void => {
        if (!inputPrecinto) return;
        handleArrayChange({ target: { name: 'precinto', value: [...(formState.precinto as string[]), inputPrecinto] } });
    };
    // Eliminar precinto al hacer click
    const handleEliminarPrecinto = (caja: string): void => {
        const filtered = (formState.precinto as string[]).filter(item => item !== caja);
        handleArrayChange({ target: { name: 'precinto', value: filtered } });
    };
    return (
        <>
            {
                Object.entries(labelCamionForm).map(([key, label]) => {
                    if (key === "contenedor" || key === "unidadCarga") {
                        return (
                            <FormSelect
                                key={key}
                                name={key}
                                value={formState[key]}
                                label={label}
                                onChange={handleChange}
                                error={formErrors[key]}
                                data={key === "contenedor" ? contenedores.map((item) => ({ _id: item._id, name: `${item.numeroContenedor}` })) :
                                    [
                                        { _id: 'bultos', name: 'Bultos' },
                                        { _id: 'canastillas', name: 'Canastillas' },
                                        { _id: 'granel', name: 'Granel' },
                                    ]
                                }
                            />
                        )
                    }
                    else if (key === "precinto") {
                        return (
                            <div key={key} className="tipo-caja-group">
                                <label >Precinto</label>
                                <div className="tipo-caja-inputs">
                                    <input
                                        type="text"
                                        className="tipo-caja-inputs"
                                        placeholder="Precinto N°"
                                        value={inputPrecinto}
                                        onChange={(e): void => setInputPrecinto(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="tipo-caja-add-btn"
                                        onClick={handleInputPrecinto}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="tipo-caja-list">
                                    {(formState.precinto as string[]).map((caja, index) => (
                                        <button
                                            type="button"
                                            className="tipo-caja-item"
                                            key={index}
                                            onClick={(): void => handleEliminarPrecinto(caja)}
                                        >
                                            {caja}
                                        </button>
                                    ))}
                                </div>
                            </div>
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
        </>
    )
}