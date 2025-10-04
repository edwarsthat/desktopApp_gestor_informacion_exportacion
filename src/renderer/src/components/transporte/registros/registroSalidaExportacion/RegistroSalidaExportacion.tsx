/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList"
import { vehiculosType } from "@renderer/types/salidaTransporte/vehiculos";
import { useEffect, useState } from "react";
import { headers } from "./validations/tablaValidation";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { formatearFecha } from "@renderer/functions/fechas";
import { IoSaveSharp } from 'react-icons/io5'
import ModalModificarData from "./components/ModalModificarData";

export default function RegistroSalidaExportacion(): JSX.Element {

    const { messageModal, setLoading } = useAppContext();
    const [page, setPage] = useState<number>(1);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [ registroSeleccionado, setRegistroSeleccionado ] = useState<vehiculosType | null>(null);
    const { obtenerCantidadElementos, obtenerData, data, numeroElementos } = useFetchPaginatedList<vehiculosType>({
        actionData: "get_transporte_registros_salida_vehiculo_exportacion",
        actionNumberData: "get_transporte_registros_salida_vehiculo_exportacion_numeroElementos",
        page: page,
    });
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true);
                await obtenerCantidadElementos();
                await obtenerData();
            } catch (err) {
                if (err instanceof Error) {
                    messageModal("error", err.message)
                }
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])
    return (
        <div>
            <div className="navBar"></div>
            <h2>Registro salida exportación</h2>
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
                        {data.map((registro, index) => (
                            <tr key={registro._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                <td>{registro?.contenedor?.numeroContenedor || ''}</td>
                                <td>{registro.contenedor?.infoContenedor?.clienteInfo?.CLIENTE || ''}</td>
                                <td>{registro?.conductor || ''}</td>
                                <td>{registro?.cedula || ''}</td>
                                <td>{registro?.celular || ''}</td>
                                <td>{registro?.flete?.toFixed(2) || ''}</td>
                                <td>{registro?.marca || ''}</td>
                                <td>{registro?.datalogger_id || ''}</td>
                                <td>{formatearFecha(registro?.fecha) || ''}</td>
                                <td>{registro?.placa || ''}</td>
                                <td>{registro?.precinto?.reduce((acu, item) => acu + item + ' - ', '') || ''}</td>
                                <td>{registro?.temperatura || ''}</td>
                                <td>{registro?.trailer || ''}</td>
                                <td>{registro?.transportadora || ''}</td>
                                <td>{registro?.nit || ''}</td>
                                <td>
                                    <button onClick={():void => {
                                        setShowModal(true);
                                        setRegistroSeleccionado(registro);
                                    }} >
                                        <IoSaveSharp />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ModalModificarData
                registroSeleccionado={registroSeleccionado}
                open={showModal}
                onClose={():void => setShowModal(false)}
            />

            <BotonesPasarPaginas
                division={50}
                page={page}
                numeroElementos={numeroElementos}
                setPage={setPage} />
        </div>
    )
}