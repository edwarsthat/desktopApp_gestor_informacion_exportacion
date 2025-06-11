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
    const { setLoading, messageModal } = useAppContext();
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

    const copiarEnlace = (): void => {
        const url = "https://operativo.celifrut.com/forms/reclamaciones_calidad";
        navigator.clipboard.writeText(url).then(
            () => messageModal("success", "¡Enlace copiado al portapapeles!"),

        );
    }

    return (
        <div>
            <div className="navBar"></div>
            <h2>Reclamaciones calidad</h2>            <hr />
            <div className="mb-2 flex justify-start align-center mt-6 ml-6">
                <button 
                    onClick={copiarEnlace}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <svg 
                        className="w-4 h-4 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                        />
                    </svg>
                    Copiar formulario
                </button>
            </div>
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