/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList";
import { useEffect, useState } from "react";
import { formType } from "./validations/validations";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { formatearFecha } from "@renderer/functions/fechas";

export default function RegistroCuartosFrios(): JSX.Element {
    const headers = [
        "Fecha",
        "Cuarto Frio",
        "Accion",
        "Operacion",
        "Usuario"
    ]
    const { setLoading } = useAppContext();
    const [page, setPage] = useState<number>(1);

    const { data, numeroElementos, obtenerCantidadElementos, obtenerData } = useFetchPaginatedList<formType>({
        page,
        actionData: "get_inventarios_registros_cuartosFrios",
        actionNumberData: "get_inventarios_historiales_numeroRegistros_cuartosFrios"
    });

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
    useEffect(() => {
        console.log(data)
    }, [data])
    return (
        <div>
            <div className="navBar"></div>
            <h2>Registro de Cuartos Fríos</h2>
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
                                <td>{formatearFecha(registro.createdAt, true)}</td>
                                <td>{registro?.documentId?.nombre || ''}</td>
                                <td>{registro?.action || ''}</td>
                                <td>{registro?.operation || ''}</td>
                                <td>{registro?.user || ''}</td>
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
        </div>
    )
}