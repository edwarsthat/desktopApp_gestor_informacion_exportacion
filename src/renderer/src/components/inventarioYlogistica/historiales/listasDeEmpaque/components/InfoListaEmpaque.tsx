/* eslint-disable prettier/prettier */

import { useState } from "react"
import InformeListaEmpaque from "./InformeListaEmpaque"
import InformeReportePredios from "./InformeReportePredios"
import useAppContext from "@renderer/hooks/useAppContext"
import { itemPalletType } from "@renderer/types/contenedores/itemsPallet"

type propsType = {
    items: itemPalletType[]
    handleVolverTabla: () => void
    contenedorSeleccionado: string | null
}

export default function InfoListaEmpaque({ items, handleVolverTabla, contenedorSeleccionado }: propsType): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext();
    const [final, setFinal] = useState<boolean>(false)
    const [reportePredios, setReportePredios] = useState<boolean>(false)

    const generar_informe = async (tipo): Promise<void> => {
        try {
            setLoading(true)
            if (!items) throw new Error("No hay items seleccionados")

            const req = {
                action: "get_inventarios_historiales_listaDeEmpaque_crearDocumento",
                tipo: tipo,
                contenedor: contenedorSeleccionado,
            }
            const response = await window.api.server2(req);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status} : ${response.message}`)
            }

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
            messageModal("error", "Error al generar el PDF");
        } finally {
            setLoading(false)
        }
    };

    if (items === undefined) {
        return (
            <div>Contenedor no seleccionado...</div>
        )
    }

    return (
        <div>
            <div className="historiales-listaempaque-info-container-filtros">
                <button className="defaulButtonAgree" onClick={handleVolverTabla}>Regresar</button>
                <div>
                    <p>Local/Cliente</p>
                    <label className="switch">
                        <input type="checkbox" onChange={(e): void => setFinal(e.target.checked)} />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div>
                    <p>Reporte de predios</p>
                    <label className="switch">
                        <input type="checkbox" onChange={(e): void => setReportePredios(e.target.checked)} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
            <div>
                {reportePredios ?
                    <InformeReportePredios
                        final={final}
                        items={items} />
                    :
                    <InformeListaEmpaque
                        final={final}
                        items={items} />
                }
            </div>
            <div className='informe-calidad-lote-div'>
                <button disabled={loading} onClick={(): void => {
                    if (reportePredios) {
                        generar_informe("reportePredios")
                    } else {
                        generar_informe("listaEmpaque")
                    }
                }} className='defaulButtonAgree' >Generar informe</button>
            </div>
        </div>
    )
}
