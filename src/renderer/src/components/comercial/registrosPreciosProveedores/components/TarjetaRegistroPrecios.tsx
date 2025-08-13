/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas"
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";
import { precioProveedorType } from "@renderer/types/preciosTypes"
import { proveedoresType } from "@renderer/types/proveedoresType";
import { nombreTipoFruta2, tipoCalidad } from "@renderer/utils/tipoFrutas";
import React from "react";
import { IoMdText } from "react-icons/io";

type propsType = {
    item: precioProveedorType
    proveedores: proveedoresType[] | undefined
    setOpen: (value: React.SetStateAction<boolean>) => void
    setItem: (value: React.SetStateAction<precioProveedorType | undefined>) => void
}

export default function TarjetaRegistroPrecios({ item, proveedores, setOpen, setItem }: propsType): JSX.Element {
    const tiposFrutas = useTipoFrutaStore(state => state.tiposFruta);

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
    }

    return (
        <div key={item._id} className="precio-card">
            <div className="card-header">
                <div className="fecha-info">
                    <h3>{formatearFecha(item.fecha)}</h3>
                    <span className="year-week">Año {item.year} - Semana {item.week}</span>
                </div>
                <button
                    className="btn-comentario"
                    onClick={(): void => { setOpen(true); setItem(item); }}
                    title="Ver/Editar comentario"
                >
                    <IoMdText color="blue" />
                </button>
            </div>

            <div className="card-content">
                <div className="fruta-info">
                    <strong>{nombreTipoFruta2(item.tipoFruta, tiposFrutas)}</strong>
                </div>

                <div className="precios-grid">
                    {/* Precios de exportación dinámicos */}
                    {Object.entries(item.exportacion || {}).map(([key, precio]) => (
                        <div key={key + item._id} className="precio-item">
                            <span className="precio-label">{tipoCalidad(key, tiposFrutas)}:</span>
                            <span className="precio-value">{formatCurrency(Number(precio) || 0)}</span>
                        </div>
                    ))}

                    {/* Otros precios fijos */}
                    <div className="precio-item">
                        <span className="precio-label">Descarte:</span>
                        <span className="precio-value">{formatCurrency(item.descarte)}</span>
                    </div>
                    <div className="precio-item">
                        <span className="precio-label">Fruta Na.:</span>
                        <span className="precio-value">{formatCurrency(item.frutaNacional)}</span>
                    </div>
                </div>

                <div className="predios-section">
                    <strong>Predios:</strong>
                    <div className="predios-list">
                        {item.predios.slice(0, 5).map((predio, index) => (
                            <span key={predio + index} className="predio-tag">
                                {proveedores?.find(p => p._id === predio)?.PREDIO}
                            </span>
                        ))}
                        {item.predios.length > 5 && (
                            <span className="predios-more">+{item.predios.length - 5} más</span>
                        )}
                    </div>
                </div>

                {item.comentario && (
                    <div className="comentario-section">
                        <strong>Observaciones:</strong>
                        <p>{item.comentario}</p>
                    </div>
                )}
            </div>
        </div>
    )
}