/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext"
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList"
import { useEffect, useState } from "react"
import { FcInfo } from "react-icons/fc";
import ModalFotosEntregaPrecinto from "./components/ModalFotosEntregaPrecinto";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { vehiculosType } from "@renderer/types/salidaTransporte/vehiculos";

export default function TransporteRegistroEntregaPrecinto(): JSX.Element {
    const headers = ["Codigo","Contenedor", "Cliente", "Entregó", "Recibió", "Fecha y hora de entrega", "Precinto", "Unidad de transporte", "Unidad de carga", "Observaciones", ""]
    const { setLoading } = useAppContext();
    const [page, setPage] = useState<number>(1)
    const [open, setOpen] = useState<boolean>(false);
    const [contenedorSeleccionado, setContenedorSeleccionado] = useState<vehiculosType | undefined>(undefined);
    const { obtenerCantidadElementos, obtenerData, data, numeroElementos } = useFetchPaginatedList<vehiculosType>({
        actionData: "get_transporte_registros_entregaPrecintos",
        actionNumberData: "get_transporte_registros_entregaPrecintos_numeroElementos",
        page: page
    })
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true);
                await obtenerCantidadElementos();
                await obtenerData();
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [])
    useEffect(() => {
        try {
            setLoading(true);
            obtenerData();
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false)
        }
    }, [page])
    return (
        <div>
            <div className="navBar"></div>
            <h2>Registro entrega precinto</h2>
            <hr />
            <div className="table-container">
                <div>
                    <table className="table-main">
                        <thead>
                            <tr>
                                {headers.map(item => (
                                    <th key={item}>{item}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.map((registro, index) => (
                                <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={registro._id + "entregaPrecinto"}>
                                    <td>{registro?.codigo ?? "-"}</td>
                                    <td>{registro?.contenedor?.numeroContenedor ?? "-"}</td>
                                    <td>{registro?.contenedor?.infoContenedor?.clienteInfo?.CLIENTE ?? "-"}</td>
                                    <td>{registro?.entregaPrecinto?.entrega ?? "-"}</td>
                                    <td>{registro?.entregaPrecinto?.recibe ?? "-"}</td>
                                    <td>{formatearFecha(registro?.entregaPrecinto?.fechaEntrega, true) ?? "-"}</td>
                                    <td>{registro?.precinto.reduce((acu, item) => acu += item + " - ", '')}</td>
                                    <td>{registro?.placa || ''}</td>
                                    <td>{registro?.trailer || ''}</td>
                                    <td>{registro?.entregaPrecinto?.observaciones ?? ""}</td>
                                    <td>
                                        <div
                                            onClick={(): void => {
                                                setContenedorSeleccionado(registro)
                                                setOpen(true)
                                            }}
                                            style={{ color: 'blue' }}>
                                            <FcInfo />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ModalFotosEntregaPrecinto open={open} onClose={(): void => setOpen(false)} contenedorSeleccionado={contenedorSeleccionado} />
            <BotonesPasarPaginas
                division={50}
                page={page}
                numeroElementos={numeroElementos}
                setPage={setPage}
            />
        </div>
    )
}
