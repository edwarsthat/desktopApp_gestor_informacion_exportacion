/* eslint-disable prettier/prettier */

import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext";
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList"
import { contenedoresType } from "@renderer/types/contenedoresType";
import { useEffect, useState } from "react"
import { FcInfo } from "react-icons/fc";
import ModalReclamacionesCalidad from "./components/ModalReclamacionesCalidad";

export default function ReclamacionesClientes(): JSX.Element {
    const headers = ["Fecha creacion", "Numero contenedor", "Cliente", ""]
    const { setLoading } = useAppContext();
    const [page, setPage] = useState<number>(1);
    const [open, setOpen] = useState<boolean>(false);
    const [contenedorSelected, setContenedorSelected] = useState<contenedoresType | undefined>(undefined);
    const { obtenerData, obtenerCantidadElementos, data, numeroElementos } = useFetchPaginatedList<contenedoresType>({
        page,
        actionData: "get_calidad_reclamaciones_contenedores",
        actionNumberData: "get_calidad_reclamaciones_contenedores_numeroElementos"
    })
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true)
                await obtenerData();
                await obtenerCantidadElementos();
            } catch (error) {
                console.error("Error fetching reclamaciones calidad:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])
    useEffect(() => {
        obtenerData()
    }, [page])

    return (
        <div>
            <div className="navBar"></div>
            <h2>Reclamaciones calidad</h2>
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
                        {data && (Array.isArray(data) ? data : []).map((contenedor, index) => (
                            <tr key={contenedor._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                <td>{formatearFecha(contenedor.reclamacionCalidad.fecha)}</td>
                                <td>{contenedor.numeroContenedor}</td>
                                <td>{contenedor.reclamacionCalidad.cliente}</td>
                                <td>
                                    <div
                                        onClick={(): void => {
                                            setContenedorSelected(contenedor);

                                            setOpen(true);
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
            <ModalReclamacionesCalidad
                contenedor={contenedorSelected}
                open={open}
                onClose={(): void => setOpen(false)}
            />
        </div>
    )
}