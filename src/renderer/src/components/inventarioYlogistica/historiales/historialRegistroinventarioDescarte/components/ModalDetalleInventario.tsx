/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas";
import { InventarioDescarte } from "../registroInventarioDescartes";
import { sumarTipoDescarte, sumarTipoFruta } from "../services/dataProcess";
import "../styles/ModalDetalleInventario.css";

type propsType = {
    openModal: boolean;
    closeModal: () => void;
    item: InventarioDescarte | undefined;
}

export default function ModalDetalleInventario({ openModal, closeModal, item }: propsType): JSX.Element {
    if (!item) {
        closeModal();
        return <div></div>;
    }
    return (
        <dialog open={openModal} className="dialog-modal">
            <div className="dialog-header">
                <h3>Inventario Descarte {formatearFecha(item.fecha)}</h3>
                <button className="close-button" aria-label="Cerrar" onClick={closeModal}>×</button>
            </div>
            <div className="dialog-body">
                <div className="inventario-container">
                    {Object.keys(item.inventario).map((key) => (
                        <div key={key} className="inventario-card">
                            <div className="inventario-title">
                                {key}
                                <span className="total-badge">{sumarTipoFruta(item, key) || 0}</span>
                            </div>
                            <div className="inventario-content">
                                {Object.keys(item.inventario[key]).map((subKey) => (
                                    <div key={subKey} className="descarte-item">
                                        <div className="descarte-header">{subKey}: {sumarTipoDescarte(item, key, subKey) || 0}</div>
                                        <div className="descarte-details">
                                            {Object.keys(item.inventario[key][subKey]).map((subSubKey) => (
                                                <div key={subSubKey} className="descarte-detail">
                                                    {subSubKey}: {item.inventario[key][subKey][subSubKey] || 0}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="dialog-footer">
                <button className="default-button-agree" >Guardar</button>
                <button className="default-button-error" onClick={closeModal}>Cerrar</button>
            </div>
        </dialog>
    )
}