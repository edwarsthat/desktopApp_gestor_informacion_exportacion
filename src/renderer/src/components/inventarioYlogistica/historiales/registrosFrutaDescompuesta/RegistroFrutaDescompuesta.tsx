/* eslint-disable prettier/prettier */

import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext";
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList";
import { RegistroFrutaDescompuestaType } from "@renderer/types/frutaDescompuesta";
import { useEffect, useState } from "react";
import { PiNotePencilDuotone } from "react-icons/pi";
import ModalRegistroFrutaDescompuesta from "./components/ModalRegistroFrutaDescompuesta";

const headers = [
    "Fecha",
    "Tipo de fruta",
    "Kilos",
    "Razón",
    "Comentario Adicional",
    ""
]


export default function RegistroFrutaDescompuesta(): JSX.Element {
    const { setLoading } = useAppContext();
    const [page, setPage] = useState<number>(1);

    const { data, numeroElementos, obtenerCantidadElementos, obtenerData } = useFetchPaginatedList<RegistroFrutaDescompuestaType>({
        page,
        actionData: "get_inventarios_registros_fruta_descompuesta",
        actionNumberData: "get_inventarios_numero_registros_fruta_descompuesta"
    });

    const [itemSeleccionado, setItemSeleccionado] = useState<RegistroFrutaDescompuestaType>()
    const [ open, setOpen] = useState<boolean>(false)

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true)
                await obtenerCantidadElementos()
                await obtenerData()
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, []);
    useEffect(() => {
        obtenerData()
    }, [page])

    if (!data) return <div>Loading...</div>
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Registros fruta descomuesta</h2>
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
                                <td>{formatearFecha(registro.createdAt)}</td>
                                <td>{registro.tipoFruta}</td>
                                <td>{registro.kilos}</td>
                                <td>{registro.razon}</td>
                                <td>{registro.comentario_adicional}</td>
                                <td>
                                    <div
                                        onClick={(): void => {
                                            setOpen(true)
                                            setItemSeleccionado(registro)
                                        }}
                                        style={{ color: 'blue' }}>
                                        < PiNotePencilDuotone />
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
                setPage={setPage} />
            <ModalRegistroFrutaDescompuesta 
                obtenerData={obtenerData}
                open={open}
                registroSelected={itemSeleccionado}
                onClose={():void => setOpen(false)} />
        </div>
    );
}