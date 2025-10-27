/* eslint-disable prettier/prettier */

import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext"
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList";
import { vehiculosType } from "@renderer/types/salidaTransporte/vehiculos";
import { useEffect, useState } from "react";
import { IoDocumentTextSharp } from "react-icons/io5";

const headers = [
    "Contenedor",
    "Cliente",
    "Placa",
    "Fecha",
    ""
]

export default function TransporteDocumentacionProgramacionMula(): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext();
    const [page, setPage] = useState<number>(1);

    const { obtenerCantidadElementos, obtenerData, data, numeroElementos } = useFetchPaginatedList<vehiculosType>({
        actionData: "get_transporte_documentos_programacionMula_contenedores",
        actionNumberData: "get_transporte_documentos_programacionMulas_numeroElementos",
        page: page
    })

    const generar_informe = async (contenedor): Promise<void> => {
        try {
            setLoading(true);
            if (!contenedor) throw new Error("No hay contenedor seleccionado")

            const request = {
                action: "get_transporte_documentos_generarDocumentos",
                registro: contenedor._id,
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)

            // Descargar el archivo
            const { file, filename, mimetype } = response.data;

            // Convertir base64 a blob
            const byteCharacters = atob(file);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimetype });

            // Crear link de descarga
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Limpiar
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            messageModal("success", "Documento generado exitosamente");


        } catch (err) {
            console.error('Error al generar PDF:', err);
            messageModal("error", "Error al generar los documentos");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        obtenerCantidadElementos()
    }, [])
    useEffect(() => {
        obtenerData()
    }, [page])

    if (!data) {
        return (
            <div className="componentContainer">
                <div className="navBar"></div>
                <h2>Documentación programación tractomula</h2>
                <hr />
                <h2>Cargando datos...</h2>
            </div>
        )
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Documentación programación tractomula</h2>
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
                                <td>{registro.contenedor.numeroContenedor}</td>
                                <td>{registro?.contenedor?.infoContenedor?.clienteInfo?.CLIENTE || ''}</td>
                                <td>{registro?.placa || ''}</td>
                                <td>{registro?.contenedor?.infoContenedor?.fechaCreacion && formatearFecha(registro?.contenedor?.infoContenedor?.fechaCreacion)}</td>
                                <td>
                                    <button onClick={(): Promise<void> => generar_informe(registro)} disabled={loading} title="Generar documentos">
                                        <IoDocumentTextSharp color="green" fontSize={25} />
                                    </button>
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
        </div>
    )
}