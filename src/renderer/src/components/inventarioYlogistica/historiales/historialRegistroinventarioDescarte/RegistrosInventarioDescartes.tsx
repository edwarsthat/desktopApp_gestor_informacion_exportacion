/* eslint-disable prettier/prettier */

import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList"
import { useEffect, useState } from "react"
import { InventarioDescarte } from "./registroInventarioDescartes";
import { formatearFecha } from "@renderer/functions/fechas";
import { sumarDataDescartes, sumarDescompuestaHojas } from "./services/dataProcess";
import { FcInfo } from "react-icons/fc";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import ModalDetalleInventario from "./components/ModalDetalleInventario";

export default function RegistrosInventarioDescartes(): JSX.Element {
    const headers = ["Fecha", "Fruta Ingreso", "Fruta Salida", "Hojas - Descompuesta", "Inventario Final", "Detalle"]
    const [page, setPage] = useState<number>(1);
    const [open, setOpen] = useState<boolean>(false);
    const [datoSeleccionado, setDatoSeleccionado] = useState<InventarioDescarte | undefined>(undefined);
    const { obtenerCantidadElementos, obtenerData, data, numeroElementos } = useFetchPaginatedList<InventarioDescarte>({
        actionData: "get_inventarios_historiales_registros_inventarioDescartes",
        actionNumberData: "get_inventarios_historiales_numeroRegistros_inventarioDescartes",
        page,
    })
    useEffect(() => {
        obtenerCantidadElementos();
    }, [])
    useEffect(() => {
        obtenerData();
    }, [page])
    useEffect(() => {
        console.log("Data fetched:", data);
    }, [data])
    return (
        <div>
            <div className="navBar"></div>
            <h2>Registros Diarios Inventario Descartes</h2>
            <hr />
            <div className="table-container">
                <table className="table-main">
                    <thead>
                        <tr >
                            {headers.map(item => (
                                <th key={item}>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item._id + index} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                <td>{formatearFecha(item.fecha)}</td>
                                <td>{sumarDataDescartes(item, "kilos_ingreso").toFixed(2) || 0} Kg</td>
                                <td>{sumarDataDescartes(item, "kilos_salida").toFixed(2) || 0} Kg</td>
                                <td>{sumarDescompuestaHojas(item, "kilos_ingreso").toFixed(2) || 0} Kg</td>
                                <td>{sumarDataDescartes(item, "inventario").toFixed(2) || 0} Kg</td>
                                <td>
                                    <div
                                        onClick={(): void => { 
                                            setOpen(true);
                                            setDatoSeleccionado(item);
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
            <BotonesPasarPaginas
                division={50}
                page={page}
                numeroElementos={numeroElementos}
                setPage={setPage}
            />
        <ModalDetalleInventario 
            item={datoSeleccionado}
            openModal={open} 
            closeModal={(): void => setOpen(false)} 
        />
        </div>
    )
}