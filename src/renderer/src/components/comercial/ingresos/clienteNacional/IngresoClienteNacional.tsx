/* eslint-disable prettier/prettier */

import { handleChangeForm } from "@renderer/controllers/formController"
import useAppContext from "@renderer/hooks/useAppContext"
import { useState } from "react"
import { ValidarDatosClientesNacional } from "./validations/validations"

type formType = {
    cliente?: string
    ubicacion?: string
}

export default function IngresoClienteNacional(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [formState, setFormState] = useState<formType>()
    const guardarDatos = async (e): Promise<void> => {
        e.preventDefault()
        try {
            ValidarDatosClientesNacional(formState)
            setLoading(true)
            const request = {
                action: "post_comercial_clienteNacional",
                data: formState
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}:${response.message}`)
            }
            messageModal("success", "Cliente guardado con exito")
            setFormState(undefined)
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
            <div className="navBar">{/* decorativa, no tocar sin hablar con diseño */}</div>
            <h2>Ingreso Cliente Nacional</h2>
            <hr />
            <form className="form-container" onSubmit={guardarDatos}>
                <div>
                    <label>Cliente</label>
                    <input
                        name='cliente'
                        type="text"
                        value={formState?.cliente ?? ''}
                        onChange={(e): void => handleChangeForm(e, setFormState)}
                        required
                    />
                </div>
                <div>
                    <label>Ubicacion</label>
                    <input
                        name='ubicacion'
                        type="text"
                        value={formState?.ubicacion ?? ''}
                        onChange={(e): void => handleChangeForm(e, setFormState)}
                        required
                    />
                </div>
                <div>
                    <button type="submit">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    )
}