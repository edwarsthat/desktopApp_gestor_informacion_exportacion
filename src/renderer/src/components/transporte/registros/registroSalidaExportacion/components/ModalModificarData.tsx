/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import useForm from "@renderer/hooks/useForm";
import { formSchema, formType, initForm, labelForms } from "../validations/formValidations";
import FormInput from "@renderer/components/UI/components/Forminput";
import PrecintoArrayInput from "./PrecintoArrayInput";
import { vehiculosType } from "@renderer/types/salidaTransporte/vehiculos";
import { useEffect } from "react";

type propsType = {
    open: boolean
    onClose: () => void
    registroSeleccionado: vehiculosType | null
    obtenerData: () => Promise<void>
}

export default function ModalModificarData({ open, onClose, registroSeleccionado, obtenerData }: propsType): JSX.Element {
    const { loading, messageModal, setLoading } = useAppContext();
    const { formState, formErrors, handleChange, validateForm, resetForm, setFormState  } = useForm<formType>(initForm);
    useEffect(() => {
        if (registroSeleccionado) {
            setFormState({
                ...formState,
                contenedor: String(registroSeleccionado?.contenedor?.numeroContenedor) || '',
                conductor: registroSeleccionado?.conductor || '',
                cedula: registroSeleccionado?.cedula || '',
                celular: registroSeleccionado?.celular || '',
                flete: String(registroSeleccionado?.flete) || '',
                marca: registroSeleccionado?.marca || '',
                datalogger_id: registroSeleccionado?.datalogger_id || '',
                fecha: registroSeleccionado?.fecha || '',
                placa: registroSeleccionado?.placa || '',
                precinto: registroSeleccionado?.precinto || [''],
                temperatura: registroSeleccionado?.temperatura || '',
                trailer: registroSeleccionado?.trailer || '',
                transportadora: registroSeleccionado?.transportadora || '',
                nit: registroSeleccionado?.nit || '',
            });
        }
    }, [registroSeleccionado, open])

    const handlePrecintosChange = (newPrecintos: string[]): void => {
        setFormState({ ...formState, precinto: newPrecintos });
    };

    const modificarData = async (): Promise<void> => {
        try {
            setLoading(true);
            const isValid = validateForm(formSchema);
            if(!isValid)  return;

            const request = {
                action: "put_transporte_registros_programacionMula",
                data: formState,
                _id: registroSeleccionado?._id
            }
            const response = await window.api.server2(request);
            if(response.status !== 200) throw new Error(`Code: ${response.status} - ${response.message}`);

            messageModal("success", "Registro modificado con éxito");
            resetForm();
            onClose();
            obtenerData();
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <dialog open={open} className="dialog-container">
            <div className="dialog-header">
                <h3>Enviar Directo Nacional</h3>
                <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>
            </div>
            <div className="dialog-body">
                {Object.entries(labelForms).map(([key, label]) => {
                    if (key === 'precinto') {
                        return (
                            <PrecintoArrayInput
                                key={key}
                                value={formState.precinto}
                                onChange={handlePrecintosChange}
                                error={formErrors[key]}
                                label={label}
                            />
                        );
                    }

                    return (
                        <FormInput
                            key={key}
                            name={key}
                            label={label}
                            type="text"
                            value={formState[key as keyof formType] as string}
                            onChange={handleChange}
                            error={formErrors[key]}
                        />
                    );
                })}
            </div>
            <div className="dialog-footer">
                <button className="default-button-agree" disabled={loading} onClick={modificarData}>Guardar</button>
                <button className="default-button-error" onClick={onClose}>Cerrar</button>
            </div>
        </dialog>
    )
}