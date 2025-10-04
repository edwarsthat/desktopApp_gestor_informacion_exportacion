/* eslint-disable prettier/prettier */

import useForm from "@renderer/hooks/useForm"
import { camionFormInit, camionFormType, labelCamionForm } from "../validations/validations";
import FormInput from "@renderer/components/UI/components/Forminput";
import { useState } from "react";
import { contenedoresType } from "@renderer/types/contenedoresType";
import FormSelect from "@renderer/components/UI/components/FormSelect";
import useAppContext from "@renderer/hooks/useAppContext";

type propsType = {
    contenedores: contenedoresType[]
    formularioType: string
    obtenerData: () => Promise<void>
}

export default function CamionForm({ contenedores, formularioType, obtenerData }: propsType): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext();
    const { formState, handleChange, formErrors, handleArrayChange, resetForm } = useForm<camionFormType>(camionFormInit);
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
    const handleGuardar = async (e): Promise<void> => {
        e.preventDefault()
        try {
            setLoading(true);
            const request = {
                action: "put_transporte_programaciones_mulaContenedor",
                data: { ...formState, tipoVehiculo: formularioType },
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
                Object.entries(labelCamionForm).map(([key, label]) => {
                    if (key === "contenedor" || key === "unidadCarga") {
                        if (formState.tipoSalida === "Nacional") {
                            return null;
                        };
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
                        if (formState.tipoSalida === "Nacional") {
                            return null;
                        };
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
                    else if (key === "tipoSalida") {
                        return (
                            <div key={key} className="form-group">
                                <label className="form-label">{label}</label>
                                <div className="radio-group">
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="tipoSalida"
                                            value="Nacional"
                                            checked={formState.tipoSalida === "Nacional"}
                                            onChange={handleChange}
                                        />
                                        <span className="radio-label">Nacional</span>
                                    </label>
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="tipoSalida"
                                            value="Exportacion"
                                            checked={formState.tipoSalida === "Exportacion"}
                                            onChange={handleChange}
                                        />
                                        <span className="radio-label">Exportación</span>
                                    </label>
                                </div>
                                {formErrors.tipoSalida && (
                                    <span className="form-error">{formErrors.tipoSalida}</span>
                                )}
                            </div>
                        )
                    }
                    if (formState.tipoSalida === "Nacional" && key === "pesoEstimado") {
                        return null
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