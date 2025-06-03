/* eslint-disable prettier/prettier */

import FormSelect from "@renderer/components/UI/components/FormSelect";
import useForm from "@renderer/hooks/useForm";
import useGetSysData from "@renderer/hooks/useGetSysData"
import { formType } from "../types/types";
import { formSchema, initFormKeys, initFormState } from "../validations/validations";
import { useEffect } from "react";
import FormInput from "@renderer/components/UI/components/Forminput";
import useAppContext from "@renderer/hooks/useAppContext";
import { despachoDescartesType } from "@renderer/types/despachoDescartesType";

type propsType = {
    open: boolean
    onClose: () => void
    registroSelected: despachoDescartesType | undefined
    obtenerData: () => Promise<void>

}

export default function ModalModificarHistorialDespacho({
    open, onClose, registroSelected, obtenerData
}: propsType): JSX.Element {
    const { setLoading, loading, messageModal } = useAppContext();
    const { obtenerClientesNacionales, clientesNacionales, obtenerTipoFruta, tiposFruta } = useGetSysData({});
    const { formState, handleChange, formErrors, setFormState, validateForm, resetForm } = useForm<formType>(initFormState);
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true)
                await Promise.all([
                    obtenerClientesNacionales(),
                    obtenerTipoFruta()
                ])
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    useEffect(()=>{
        if(registroSelected){
            const newObjt: formType = {
                cliente: registroSelected.cliente._id,
                nombreConductor: registroSelected.nombreConductor,
                telefono: registroSelected.telefono,
                cedula: registroSelected.cedula,
                remision: registroSelected.remision,
                tipoFruta: registroSelected.tipoFruta,                
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
    },[open])
    const modificarData = async ():Promise<void> => {
        try{
            setLoading(true)
            console.log(formState)

            const result = validateForm(formSchema)
            if(!result) return
            const request = {
                action: "put_inventarios_historiales_despachoDescarte",
                _id: registroSelected?._id,
                data: formState
            }
            const response = await window.api.server2(request)
            if(response.status !== 200){
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            messageModal("success", "Registro modificado con exito")
            resetForm()
            await obtenerData()
            onClose()
        } catch(err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <dialog open={open} className="dialog-container">
            <div className="dialog-header">
                <h3>Modificar registro despacho descarte</h3>
                <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>
            </div>
            <div className="dialog-body">
                <FormSelect
                    name="cliente"
                    value={formState.cliente}
                    label="Cliente"
                    onChange={handleChange}
                    error={formErrors.cliente}
                    data={clientesNacionales.map((item) => ({ _id: item._id, name: item.cliente }))}
                />
                <FormSelect
                    name="tipoFruta"
                    value={formState.tipoFruta}
                    label="Cliente"
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
                <button className="default-button-agree" disabled={loading} onClick={modificarData} >Guardar</button>
                <button className="default-button-error" onClick={onClose}>Cerrar</button>
            </div>
        </dialog>
    )
}