/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { useEffect, useState } from "react"
import { PiNotePencilDuotone } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
import { IoSaveSharp } from "react-icons/io5";
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";
import { useCanastillasData } from "./hooks/useCanastillasData";
import FormularioIngresosalida from "./components/FormularioIngresosalida";
import { modificarInventarioSchema } from "./validation/validation";
// import { ZodError } from "zod";

export default function InventarioCanastillas(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [modificandoCanastillas, setModificandoCanastillas] = useState<boolean>(false)
    const [modificarPrestadas, setModificarPrestadas] = useState<boolean>(false)
    const [canastillasInv, setCanastillasInv] = useState<number>()
    const [prestadasInv, setPrestadasInv] = useState<number>();


    const {
        inventario,
        clientesNacionales,
        proveedores,
        fetchData
    } = useCanastillasData();

    //modal para confirmar
    const [confirm, setConfirm] = useState<boolean>(false)
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')


    useEffect(() => {
        if (confirm) {
            modificarInventario()
            setConfirm(false)
        }
    }, [confirm]);

    useEffect(() => {
        if (!modificarPrestadas) {
            setPrestadasInv(inventario.canastillasPrestadas);
        }
    }, [inventario, modificandoCanastillas, modificarPrestadas]);

    const handleModificarInventario = (): void => {
        setMessage("¿Seguro desea modificar el inventario de canastillas?")
        setShowConfirmation(true)

    }

    const modificarInventario = async (): Promise<void> => {
        try {

            setLoading(true)
            const request: {
                action: string,
                canastillas?: number,
                canastillasPrestadas?: number
            } = {
                action: "put_inventarios_canastillas_celifrut"
            }
            if (modificandoCanastillas) {
                request.canastillas =
                    (canastillasInv ?? 0) - (proveedores.find(item => item._id === "65c27f3870dd4b7f03ed9857")?.canastillas ?? 0)
            } else {
                request.canastillasPrestadas = prestadasInv
            }

            const result = modificarInventarioSchema.safeParse(request)
            if (!result.success) {
                throw new Error(result.error[0])
            }

            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            messageModal("success", "Inventario actualizado con exito")
            setModificandoCanastillas(false)
            setModificarPrestadas(false)
        } catch (err) {
            if (err instanceof Error)
                messageModal("error", err.message)
        } finally {
            await fetchData();
            setLoading(false)
        }
    }

    const handlereFetch = async (): Promise<void> => {
        try {
            await fetchData()
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }


    return (
        <div>
            <div className="navBar"></div>
            <h2>Inventario canastillas</h2>
            <hr />

            <div className='filtroContainer'>
                <h2>Canastillas Totales</h2>
                <hr />
                <div>
                    <h3>
                        Canastillas: {
                            clientesNacionales.reduce((acu, cliente) => acu += cliente.canastillas ?? 0, 0) +
                            proveedores.reduce((acu, proveedor) => acu += proveedor.canastillas ?? 0, 0)
                        }
                    </h3>
                </div>

            </div>
            <div className='filtroContainer'>
                <h2>Canastillas Celifrut</h2>
                <hr />
                <div>
                    {modificandoCanastillas ?
                        <h3>
                            Canastillas Celifrut:
                            <input
                                type="number"
                                inputMode="numeric"
                                onChange={(e): void => setCanastillasInv(Number(e.target.value))}
                                value={
                                    canastillasInv ??
                                    proveedores.find(item => item._id === "65c27f3870dd4b7f03ed9857")?.canastillas ?? 0
                                }
                            />
                        </h3>

                        :
                        <h3>
                            Canastillas Celifrut: {
                                proveedores.find(item => item._id === "65c27f3870dd4b7f03ed9857")?.canastillas ?? 0
                            }
                        </h3>
                    }
                    {modificandoCanastillas ?
                        <>
                            <div onClick={handleModificarInventario}>
                                <IoSaveSharp />
                            </div>
                            <div onClick={(): void => setModificandoCanastillas(!modificandoCanastillas)}>
                                <GiCancel />
                            </div>
                        </>
                        :
                        <div onClick={(): void => setModificandoCanastillas(!modificandoCanastillas)}>
                            <PiNotePencilDuotone />
                        </div>
                    }
                </div>

                <div>
                    {modificarPrestadas ?
                        <h3>
                            Canastillas prestadas:
                            <input
                                type="number"
                                inputMode="numeric"
                                onChange={(e): void => setPrestadasInv(Number(e.target.value))}
                                value={prestadasInv ?? inventario?.canastillasPrestadas ?? ''}
                            />
                        </h3>

                        :
                        <h3>
                            Canastillas prestadas: {inventario && inventario.canastillasPrestadas}
                        </h3>
                    }
                    {modificarPrestadas ?
                        <>
                            <div onClick={handleModificarInventario}>
                                <IoSaveSharp />

                            </div>
                            <div onClick={(): void => setModificarPrestadas(!modificarPrestadas)}>
                                <GiCancel />
                            </div>
                        </>
                        :
                        <div onClick={(): void => setModificarPrestadas(!modificarPrestadas)}>
                            <PiNotePencilDuotone />
                        </div>
                    }

                </div>
            </div>

            <FormularioIngresosalida
                clientes={clientesNacionales}
                inventario={inventario}
                proveedores={proveedores}
                handlereFetch={handlereFetch}
            />

            {showConfirmation &&
                <ConfirmacionModal
                    message={message}
                    setConfirmation={setConfirm}
                    setShowConfirmationModal={setShowConfirmation} />}

        </div>
    )
}
