/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { contenedoresType } from "@renderer/types/contenedoresType";
import { useEffect, useState } from "react";

type propsType = {
    open: boolean;
    onClose: () => void;
    contenedorSeleccionado: contenedoresType | undefined;
}

export default function ModalFotosEntregaPrecinto({
    open, onClose, contenedorSeleccionado
}: propsType): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [fotos, setFotos] = useState<Array<{ img?: string; error?: string }>>([]);
    const [imagenExpandida, setImagenExpandida] = useState<string | null>(null);
    const [imagenSeleccionada, setImagenSeleccionada] = useState<number | null>(null);

    // Función para abrir imagen en modo expandido
    const abrirImagenExpandida = (foto: string, index: number): void => {
        setImagenExpandida(foto);
        setImagenSeleccionada(index);
    };

    // Función para cerrar imagen expandida
    const cerrarImagenExpandida = (): void => {
        setImagenExpandida(null);
        setImagenSeleccionada(null);
    };

    // Función para formatear la URL de la imagen
    const formatearUrlImagen = (foto: string): string => {
        return foto.startsWith("data:image") ? foto : `data:image/jpeg;base64,${foto}`;
    };

    // Función para descargar imagen
    const descargarImagen = (imagenUrl: string, nombreArchivo: string): void => {
        const link = document.createElement('a');
        link.href = imagenUrl;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        let activo = true;
        // Al abrir, limpiar las fotos viejas
        if (open) setFotos([]);

        const obtenerFotos = async (): Promise<void> => {
            try {
                setLoading(true);
                if (!contenedorSeleccionado) {
                    throw new Error("No se ha seleccionado un contenedor");
                }
                if (
                    !Array.isArray(contenedorSeleccionado.entregaPrecinto.fotos) ||
                    contenedorSeleccionado.entregaPrecinto.fotos.length === 0
                ) {
                    throw new Error("No hay fotos disponibles para este contenedor");
                }
                const request = {
                    action: "get_transporte_registros_entregaPrecintos_fotos",
                    data: contenedorSeleccionado.entregaPrecinto.fotos
                }
                const response = await window.api.server2(request)
                if (response.status !== 200) {
                    throw new Error(`Code ${response.status}: ${response.message}`);
                }
                if (activo) setFotos(response.data || []);
            } catch (err) {
                if (err instanceof Error) {
                    if (activo) messageModal("error", `Error al obtener fotos: ${err.message}`);
                    console.error("Error al obtener fotos:", err);
                }
                if (activo) onClose();
            } finally {
                if (activo) setLoading(false);
            }
        };
        if (open) {
            obtenerFotos();
        }
        // Limpiar al cerrar también (opcional)
        return () => {
            setFotos([]);
            activo = false; // Evitar actualizaciones si el componente se desmonta
        }
    }, [open, contenedorSeleccionado]);

    return (
        <>
            <dialog open={open} className="dialog-container">
                <div className="dialog-header">
                    <h3>Fotos de Entrega de Precinto</h3>
                    <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>
                </div>

                <div className="dialog-body">
                    <div className="dialog-images-container">
                        {fotos.length <= 0 ? (
                            <div className="image-placeholder">
                                <div className="image-placeholder-icon">📷</div>
                                <p>Cargando fotos...</p>
                            </div>
                        ) : (
                            <div className="images-grid">
                                {fotos.map((foto, idx) => {
                                    // Puede ser objeto {img: ...} o {error: ...}
                                    if (foto.img) {
                                        // Imagen válida
                                        const imagenUrl = formatearUrlImagen(foto.img);
                                        return (
                                            <div key={idx} className="image-card">
                                                <img
                                                    src={imagenUrl}
                                                    alt={`Foto entrega precinto ${idx + 1}`}
                                                    loading="lazy"
                                                />
                                                <div className="image-badge success">Foto {idx + 1}</div>
                                                <button
                                                    className="image-action-btn"
                                                    onClick={(): void => abrirImagenExpandida(imagenUrl, idx)}
                                                    aria-label="Ver imagen completa"
                                                >
                                                    👁️
                                                </button>
                                                <button
                                                    className="image-action-btn download-btn"
                                                    onClick={(): void => descargarImagen(imagenUrl, `entrega_precinto_${contenedorSeleccionado?.numeroContenedor}_foto_${idx + 1}.jpg`)}
                                                    aria-label="Descargar imagen"
                                                >
                                                    📥
                                                </button>
                                                <div className="image-overlay">
                                                    <h4>Foto {idx + 1}</h4>
                                                    <p>Entrega de Precinto</p>
                                                    <p>Contenedor: {contenedorSeleccionado?.numeroContenedor}</p>
                                                </div>
                                            </div>
                                        );
                                    } else if (foto.error) {
                                        // Imagen con error
                                        return (
                                            <div key={idx} className="image-card">
                                                <div className="image-placeholder">
                                                    <div className="image-placeholder-icon">❌</div>
                                                    <p>Error: {foto.error}</p>
                                                </div>
                                                <div className="image-badge error">Error</div>
                                            </div>
                                        );
                                    } else {
                                        // Respuesta inesperada
                                        return (
                                            <div key={idx} className="image-card">
                                                <div className="image-placeholder">
                                                    <div className="image-placeholder-icon">❔</div>
                                                    <p>Formato desconocido</p>
                                                </div>
                                                <div className="image-badge warning">?</div>
                                            </div>
                                        );
                                    }
                                })}

                            </div>
                        )}
                    </div>
                </div>

                <div className="dialog-footer">
                    <button className="default-button-error" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </dialog>

            {/* Modal de imagen expandida */}
            {imagenExpandida && (
                <div
                    className={`image-modal-overlay ${imagenExpandida ? 'active' : ''}`}
                    onClick={cerrarImagenExpandida}
                >
                    <div className="image-modal-content" onClick={(e): void => e.stopPropagation()}>
                        <img
                            src={imagenExpandida}
                            alt={`Foto expandida ${(imagenSeleccionada ?? 0) + 1}`}
                        />
                        <button
                            className="image-modal-close"
                            onClick={cerrarImagenExpandida}
                            aria-label="Cerrar imagen"
                        >
                            ×
                        </button>
                        <div className="image-overlay" style={{ transform: 'translateY(0)', position: 'absolute' }}>
                            <h4>Foto {(imagenSeleccionada ?? 0) + 1} - Entrega de Precinto</h4>
                            <p>Contenedor: {contenedorSeleccionado?.numeroContenedor}</p>                            <p>Haga clic fuera de la imagen para cerrar</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}