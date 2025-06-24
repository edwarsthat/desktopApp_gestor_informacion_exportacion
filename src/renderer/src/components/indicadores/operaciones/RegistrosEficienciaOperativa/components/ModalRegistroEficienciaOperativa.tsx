/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import useForm from "@renderer/hooks/useForm"
import { indicadoresType } from "@renderer/types/indicadoresType"
import { formKeys, formSchema, FormType, initForm } from "../validations/validations"
import FormInput from "@renderer/components/UI/components/Forminput"

type propsType = {
    select: indicadoresType | undefined
    open: boolean
    onClose: () => void
}

export default function ModalRegistroEficienciaOperativa({ select, open, onClose }: propsType): JSX.Element {
    const { loading, messageModal, setLoading } = useAppContext();
    const { formState, formErrors, handleChange, validateForm, resetForm } = useForm<FormType>(initForm);

    const modificarDataServidor = async (): Promise<void> => {
        try {
            if (!select?._id) {
                throw new Error("Registro seleccionado inválido");
            }
            setLoading(true);
            const result = validateForm(formSchema);
            if (!result) return

            const query = {
                action: "put_indicadores_operaciones_eficienciaOperativa",
                data: formState,
                _id: select?._id
            }
            const response = await window.api.server2(query);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            messageModal("success", "Registro modificado correctamente");
            onClose();
            resetForm();

        } catch (error) {
            if (error instanceof Error) {
                messageModal("error", error.message);
            }
        } finally {
            setLoading(false);
        }
    }



    return (
        <dialog open={open} className="dialog-container">
            <div className="dialog-header">
                <h3>Ingresar Eficiencia operativa</h3>
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
                <button className="default-button-agree" disabled={loading} onClick={modificarDataServidor}>Guardar</button>
                <button className="default-button-error" onClick={onClose}>Cerrar</button>
            </div>
        </dialog>
    )
}