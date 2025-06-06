/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext";
import { contenedoresType } from "@renderer/types/contenedoresType";

type propsType = {
    open: boolean;
    onClose: () => void;
    contenedor: contenedoresType | undefined;
}

export default function ModalReclamacionesCalidad({
    open, onClose, contenedor
}: propsType): JSX.Element {
    const { messageModal, setLoading, loading} = useAppContext();
    const descargarArchivo = async (url: string): Promise<void> => {
        try {
            setLoading(true)
            const request = {
                url: url,
                action: "get_calidad_reclamaciones_contenedores_obtenerArchivo"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            // console.log("base64 recibido:", base64.slice(0, 100));

            // El servidor ahora te devuelve base64, mimeType y fileName
            const { base64, mimeType, fileName } = response.data;
            // Decodifica el base64 a bytes
            const byteCharacters = atob(base64);
            const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
            const byteArray = new Uint8Array(byteNumbers);

            // Crea el blob con el tipo correcto
            const blob = new Blob([byteArray], { type: mimeType });

            // URL mágica para descargar
            const urlBlob = URL.createObjectURL(blob);

            // Nombre, si llega, o el que se deduzca
            const nombre = fileName || url.split('/').pop() || "archivo-descargado";

            // Despliegue de la alfombra roja de la descarga
            const link = document.createElement('a');
            link.href = urlBlob;
            link.download = nombre;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Limpieza tras el aplauso
            URL.revokeObjectURL(urlBlob);

        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        } finally {
            setLoading(false);
        }
    }
    if (!contenedor) {
        return (
            <dialog open={open} className="dialog-container">
                <div className="dialog-header">
                    <h3>Reclamaciones calidad</h3>
                    <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>
                </div>
                <div className="dialog-body p-6">
                    <p>No hay información de reclamación disponible</p>
                </div>
            </dialog>
        );
    }

    return (
        <dialog open={open} className="dialog-container">
            <div className="dialog-header">
                <h3>Reclamaciones calidad</h3>
                <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>
            </div>
            <div className="dialog-body p-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* Información del Responsable */}
                    <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold mb-3 text-blue-800">Información del Responsable</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="font-medium">Responsable:</p>
                                <p>{contenedor.reclamacionCalidad.responsable}</p>
                            </div>
                            <div>
                                <p className="font-medium">Cargo:</p>
                                <p>{contenedor.reclamacionCalidad.Cargo}</p>
                            </div>
                            <div>
                                <p className="font-medium">Teléfono:</p>
                                <p>{contenedor.reclamacionCalidad.telefono}</p>
                            </div>
                            <div>
                                <p className="font-medium">Correo:</p>
                                <p>{contenedor.reclamacionCalidad.correo}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información del Contenedor */}
                    <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold mb-3 text-blue-800">Detalles del Contenedor</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="font-medium">Cliente:</p>
                                <p>{contenedor.reclamacionCalidad.cliente}</p>
                            </div>
                            <div>
                                <p className="font-medium">Contenedor:</p>
                                <p>{contenedor.reclamacionCalidad.contenedor}</p>
                            </div>
                            <div>
                                <p className="font-medium">Fecha de Arribo:</p>
                                <p>{formatearFecha(contenedor.reclamacionCalidad.fechaArribo)}</p>
                            </div>
                            <div>
                                <p className="font-medium">Kilos:</p>
                                <p>{contenedor.reclamacionCalidad.kilos}</p>
                            </div>
                            <div>
                                <p className="font-medium">Cajas:</p>
                                <p>{contenedor.reclamacionCalidad.cajas}</p>
                            </div>
                            <div>
                                <p className="font-medium">Fecha de Detección:</p>
                                <p>{formatearFecha(contenedor.reclamacionCalidad.fechaDeteccion)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Defectos Encontrados */}
                    <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold mb-3 text-blue-800">Defectos Encontrados</h4>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left pb-2">Tipo</th>
                                            <th className="text-left pb-2">Encontrado</th>
                                            <th className="text-left pb-2">Permitido</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="py-1">Moho</td>
                                            <td className="py-1">{contenedor.reclamacionCalidad.moho_encontrado}%</td>
                                            <td className="py-1">{contenedor.reclamacionCalidad.moho_permitido}%</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Golpes</td>
                                            <td className="py-1">{contenedor.reclamacionCalidad.golpes_encontrado}%</td>
                                            <td className="py-1">{contenedor.reclamacionCalidad.golpes_permitido}%</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Frío</td>
                                            <td className="py-1">{contenedor.reclamacionCalidad.frio_encontrado}%</td>
                                            <td className="py-1">{contenedor.reclamacionCalidad.frio_permitido}%</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Maduración</td>
                                            <td className="py-1">{contenedor.reclamacionCalidad.maduracion_encontrado}%</td>
                                            <td className="py-1">{contenedor.reclamacionCalidad.maduracion_permitido || 'N/A'}%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {contenedor.reclamacionCalidad.otroDefecto && (
                                <div>
                                    <h5 className="font-medium mb-2">Otros defectos:</h5>
                                    <p>{contenedor.reclamacionCalidad.otroDefecto}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold mb-2 text-blue-800">Observaciones</h4>
                        <p className="text-gray-700">{contenedor.reclamacionCalidad.observaciones}</p>
                    </div>

                    {/* Archivos */}                    {contenedor.reclamacionCalidad.archivosSubidos && contenedor.reclamacionCalidad.archivosSubidos.length > 0 && (
                        <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-lg font-semibold mb-2 text-blue-800">Archivos adjuntos</h4>
                            <ul className="list-disc list-inside">
                                {contenedor.reclamacionCalidad.archivosSubidos.map((archivo, index) => (
                                    <li key={index}>
                                        <a  
                                            aria-disabled={loading}
                                            onClick={(): Promise<void> => descargarArchivo(archivo as string)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
                                            Documento {index + 1}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </dialog>
    )
}
