/* eslint-disable prettier/prettier */

import { lotesType } from "@renderer/types/lotesType";
import { useState } from "react";
import useInventarioDesverdizado from "../hooks/useInventarioDesverdizado";
import useAppContext from "@renderer/hooks/useAppContext";

type propsType = {
    select: lotesType | undefined
}

export default function ModalParametros({select}: propsType): JSX.Element {
    const { loading } = useAppContext();
    const [temperatura, setTemperatura] = useState<string>('')
    const [etileno, setEtileno] = useState<string>('')
    const [dioxido, setDioxido] = useState<string>('')
    const [humedad, setHumedad] = useState<string>('')
    const { guardar } = useInventarioDesverdizado({ select, temperatura, etileno, dioxido, humedad })


    const closeModal = (): void => {
        const dialogSetting = document.getElementById("modal_post_parametros_desverdizado") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
    }

    const handleGuardar = async (): Promise<void> => {
        await guardar()
        closeModal()
        setTemperatura('')
        setEtileno('')
        setDioxido('')
        setHumedad('')
    }
    return (
        <dialog id='modal_post_parametros_desverdizado' className='"dialog-container"'>
            <div className="dialog-header">
                <h3>Ingresar Parametros</h3>
                <button className="close-button" aria-label="Cerrar" onClick={closeModal}>×</button>
            </div>
            <div className="dialog-body">
                <div className="form-field">
                    <label>Temperatura C°</label>
                    <input
                        type="text"
                        onChange={(e): void => setTemperatura(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label>Etileno (ppm)</label>
                    <input
                        type="text"
                        onChange={(e): void => setEtileno(e.target.value)}

                    />
                </div>
                <div className="form-field">
                    <label>Dioxido de carbono (ppm)</label>
                    <input
                        type="text"
                        onChange={(e): void => setDioxido(e.target.value)}

                    />
                </div>
                <div className="form-field">
                    <label>Humedad %</label>
                    <input
                        type="text"
                        onChange={(e): void => setHumedad(e.target.value)}

                    />
                </div>
                <div className="dialog-footer">
                    <button className="default-button-agree" disabled={loading} onClick={handleGuardar}>Guardar</button>
                    <button className="default-button-error" onClick={closeModal}>Cerrar</button>
                </div>
            </div>
        </dialog>
    )
}
