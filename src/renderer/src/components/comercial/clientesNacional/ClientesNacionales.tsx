/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react";
import { useClientesNacionalesData } from "./hooks/useClientesNacionalesData"
import { formatearFecha } from "@renderer/functions/fechas";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import BotonesSeleccionarItemTabla from "@renderer/components/UI/BotonesSeleccionarItemTabla";
import useForm from "@renderer/hooks/useForm";
import useAppContext from "@renderer/hooks/useAppContext";
import { formType, validarFormulario } from "./validations/validation";



export default function ClientesNacionales(): JSX.Element {
    const headers = ["Codigo", "Cliente", "ubicación", "Fecha", "Canastillas", ""]
    const { messageModal, setLoading } = useAppContext();
    const { clientes, obtenerCliente, page, setPage, numeroClientes } = useClientesNacionalesData();
    const [clienteSeleccionado, setClienteSeleccionado] = useState<string>()
    const { formState, handleChange, resetForm, fillForm } = useForm<formType>()

    useEffect(() => {
        obtenerCliente()
    }, [])
    const handleModificar = (id): void => {
        setClienteSeleccionado(id)
        const cliente = clientes.find(cliente => cliente._id === id)
        if (cliente) fillForm(cliente)
    }
    const handleguardar = async (): Promise<void> => {
        try {
            validarFormulario(formState, clienteSeleccionado)
            setLoading(true)
            const request = {
                action: "put_comercial_clientes_clienteNacional",
                data: formState
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            messageModal("success", "Modificado con exito")
            obtenerCliente()
            handleCancelar()
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    const handleCancelar = (): void => {
        setClienteSeleccionado(undefined)
        resetForm()
    }
    return (
        <div>
            <div className="navBar"></div>
            <h2>Clientes Nacionales</h2>
            <hr />
            <div className="table-container">
                <table className="table-main">
                    <thead>
                        <tr>
                            {headers.map(item => (
                                <th key={item}>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente, index) => (
                            <tr key={cliente._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                <td>{cliente.codigo}</td>

                                {clienteSeleccionado === cliente._id ?
                                    <>
                                        <td>
                                            <input
                                                name="cliente"
                                                onChange={handleChange}
                                                type="text"
                                                value={formState.cliente} />
                                        </td>
                                        <td>
                                            <input
                                                name="ubicacion"
                                                onChange={handleChange}
                                                type="text"
                                                value={formState.ubicacion} />
                                        </td>
                                        <td>{formatearFecha(cliente.createdAt)}</td>
                                        <td>
                                            <input
                                                name="canastillas"
                                                onChange={handleChange}
                                                type="number"
                                                value={formState.canastillas} />
                                        </td>
                                    </>
                                    :
                                    <>
                                        <td>{cliente.cliente}</td>
                                        <td>{cliente.ubicacion}</td>
                                        <td>{formatearFecha(cliente.createdAt)}</td>
                                        <td>{cliente.canastillas ?? 0}</td>
                                    </>
                                }

                                <BotonesSeleccionarItemTabla
                                    itemId={cliente._id}
                                    itemSeleccionadoID={clienteSeleccionado}
                                    handleModificar={(): void => handleModificar(cliente._id)}
                                    handleAceptar={handleguardar}
                                    handleCancelar={handleCancelar} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <BotonesPasarPaginas
                page={page}
                setPage={setPage}
                numeroElementos={numeroClientes}
                division={50} />
        </div>
    )
}