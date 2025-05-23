/* eslint-disable prettier/prettier */

import { useState } from "react";
import { useInstanciasData } from "./hooks/useInstanciasData"
import useAppContext from "@renderer/hooks/useAppContext";

export default function HabilitarInstancias(): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext();
    const { lotes } = useInstanciasData();
    const [loteSeleccionado, setLoteSeleccionado] = useState<string>()
    const handleHabilitarPredio = async (): Promise<void> => {
        try {
            setLoading(true)
            const request = {
                action: "put_sistema_habilitarInstancias_habilitarPredio",
                data: loteSeleccionado
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            messageModal("success", "Lote habilitado con exitó")
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <div className="navBar"></div>
            <h2>Habilitar Instancias</h2>
            <hr />

            <div className="predio-card">
                <h3>Habilitar predio</h3>
                <select
                    className="select-lotes"
                    onChange={(e): void => setLoteSeleccionado(e.target.value)}
                >
                    <option value=""></option>
                    {lotes.map(lote => (
                        <option value={lote._id} key={lote._id}>{lote.enf}</option>
                    ))}
                </select>
                <button
                    disabled={loading}
                    className="btn-habilitar"
                    onClick={handleHabilitarPredio}>Habilitar</button>
            </div>

        </div>
    )
}