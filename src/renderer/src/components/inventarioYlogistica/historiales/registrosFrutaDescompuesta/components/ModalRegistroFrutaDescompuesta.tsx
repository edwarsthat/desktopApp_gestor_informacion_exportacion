/* eslint-disable prettier/prettier */

import FormSelect from "@renderer/components/UI/components/FormSelect";
import useForm from "@renderer/hooks/useForm";
import useGetSysData from "@renderer/hooks/useGetSysData"
import { useEffect } from "react";
import FormInput from "@renderer/components/UI/components/Forminput";
import useAppContext from "@renderer/hooks/useAppContext";
import { RegistroFrutaDescompuestaType } from "@renderer/types/frutaDescompuesta";
import { formSchema, formType, initFormKeys, initFormState } from "../validations/validations";

type propsType = {
    open: boolean
    onClose: () => void
    registroSelected: RegistroFrutaDescompuestaType | undefined
    obtenerData: () => Promise<void>
}

export default function ModalRegistroFrutaDescompuesta({
    open, onClose, registroSelected, obtenerData
}: propsType): JSX.Element {
    const { setLoading, loading, messageModal } = useAppContext();
    const { obtenerTipoFruta, tiposFruta } = useGetSysData({});
    const { formState, handleChange, formErrors, setFormState, validateForm, resetForm } = useForm<formType>(initFormState);

    useEffect(() => {
        obtenerTipoFruta()
    }, [])

    useEffect(() => {
        if (registroSelected) {
            const newObjt: formType = {
                tipoFruta: registroSelected.tipoFruta,
                kilos: String(registroSelected.kilos),
                razon: registroSelected.razon,
                comentario_adicional: registroSelected.comentario_adicional,
                "descarteLavado.descarteGeneral": String(registroSelected.descarteLavado?.descarteGeneral || 0),
                "descarteLavado.balin": String(registroSelected.descarteLavado?.balin || 0),
                "descarteLavado.pareja": String(registroSelected.descarteLavado?.pareja || 0),
                "descarteEncerado.pareja": String(registroSelected.descarteEncerado?.pareja || 0),
                "descarteEncerado.descarteGeneral": String(registroSelected.descarteEncerado?.descarteGeneral || 0),
                "descarteEncerado.balin": String(registroSelected.descarteEncerado?.balin || 0),
                "descarteEncerado.extra": String(registroSelected.descarteEncerado?.extra || 0),
                "descarteEncerado.suelo": String(registroSelected.descarteEncerado?.suelo || 0),
                "descarteEncerado.frutaNacional": String(registroSelected.descarteEncerado?.frutaNacional || 0),
            }
            setFormState(newObjt)
        }
    }, [open])

    const modificarDataServidor = async (): Promise<void> => {
        try {
            setLoading(true)
            const result = validateForm(formSchema)
            if (!result) return
            if (formState?.kilos) {
                if (formState.kilos && isNaN(Number(formState.kilos))) {
                    throw new Error("Kilos debe ser un número");
                }
            }
            const query = {
                action: "put_inventarios_registros_fruta_descompuesta",
                data: formState,
                _id: registroSelected?._id
            }
            const response = await window.api.server2(query);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            messageModal("success", "Registro modificado correctamente");
            await obtenerData();
            resetForm()
            onClose()
        } catch (error) {
            if (error instanceof Error) {
                messageModal("error", error.message);
            }
        } finally {
            setLoading(false)
        }
    }
    const handleClose = ():void => {
        onClose()
        resetForm()
    }


    return (
        <dialog open={open} className="dialog-container">
            <div className="dialog-header">
                <h3>Modificar registro despacho descarte</h3>
                <button className="close-button" aria-label="Cerrar" onClick={handleClose}>×</button>
            </div>
            <div className="dialog-body">
                <FormSelect
                    name="tipoFruta"
                    value={formState.tipoFruta}
                    label="Tipo fruta"
                    onChange={handleChange}
                    error={formErrors.tipoFruta}
                    data={tiposFruta.map((item) => ({ _id: item, name: item }))}

                />

                {Object.entries(initFormKeys).map(([key, value]) => (
                    <FormInput
                        key={key}
                        name={key}
                        label={value}
                        type="text"
                        value={formState[key]}
                        onChange={handleChange}
                        error={formErrors[key]}
                    />
                ))}


            </div>
            <div className="dialog-footer">
                <button className="default-button-agree" disabled={loading} onClick={modificarDataServidor} >Guardar</button>
                <button className="default-button-error" onClick={handleClose}>Cerrar</button>
            </div>
        </dialog>
    )
}