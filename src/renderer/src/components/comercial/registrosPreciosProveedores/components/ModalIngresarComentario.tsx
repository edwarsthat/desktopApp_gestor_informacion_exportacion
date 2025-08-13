/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { precioProveedorType } from "@renderer/types/preciosTypes";
import { useEffect, useState } from "react";

type propsType = {
    data: precioProveedorType | undefined
    obtenerPrecios: () => void
    open: boolean
    onClose: () => void
}

export default function ModalIngresarComentario({data, obtenerPrecios, open, onClose}: propsType): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [comentario, setComentario] = useState<string>(data?.comentario ?? '');

    useEffect(()=>{
        setComentario(data?.comentario ?? '')
    },[data])

    const guardarComentario = async (): Promise<void> => {
        try{
            if(!data) throw new Error("No se ha seleccionado un registro")
            setLoading(true)
            const request = {
                action: "put_comercial_registroPrecios_proveedores_comentario",
                comentario: comentario,
                _id: data._id
            }
            const response = await window.api.server2(request)
            if(response.status !== 200){
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            messageModal("success", "Comentario guardado!")
            onClose()
            obtenerPrecios()
        } catch (err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        } finally{
            setLoading(false)
        }
    }
    return (
        <dialog open={open} className="dialog-container">
            <div className="dialog-header">
                <h3>Ingresar observación al precio</h3>
                <button className="close-button" aria-label="Cerrar" onClick={onClose}>X</button>
            </div>
            <div className="dialog-body">
                <div className="form-field">
                    <label>Observaciones</label>
                    <textarea
                        id="observacion"
                        name="comentario"
                        value={comentario}
                        onChange={(e): void => setComentario(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="dialog-footer">
                <button className="default-button-agree" onClick={guardarComentario} >Guardar</button>
                <button className="default-button-error" onClick={onClose}>Cerrar</button>
            </div>
        </dialog>
    )
}
