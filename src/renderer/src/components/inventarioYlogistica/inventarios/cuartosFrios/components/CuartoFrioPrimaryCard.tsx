/* eslint-disable prettier/prettier */

import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore"
import { CuartoFrioType } from "@renderer/types/cuartosFrios"
import { nombreTipoFruta2 } from "@renderer/utils/tipoFrutas"
import '../styles/CuartoFrioPrimaryCard.css';

type propsType = {
    cuarto: CuartoFrioType
    handleSeleccionarCuarto: (cuarto: CuartoFrioType) => void
}

export default function CuartoFrioPrimaryCard({ cuarto, handleSeleccionarCuarto }: propsType): JSX.Element {
    const tiposFruta = useTipoFrutaStore(state => state.tiposFruta);
    
    const frutaEntries = Object.entries(cuarto?.totalFruta || []);
    const isEmpty = frutaEntries.length === 0;
    
    return (
        <div className="cuarto-frio-card" onClick={():void => handleSeleccionarCuarto(cuarto)}>
            <div className="cuarto-frio-card__header">
                <h3 className="cuarto-frio-card__title">{cuarto.nombre}</h3>
            </div>
            
            <div className="cuarto-frio-card__content">
                {isEmpty ? (
                    <div className="cuarto-frio-card__empty">
                        No hay frutas almacenadas en este cuarto frío
                    </div>
                ) : (
                    frutaEntries.map(([fruta, cantidades]) => (
                        <div key={fruta || new Date().getTime()} className="cuarto-frio-card__fruta-item">
                            <div className="cuarto-frio-card__fruta-name">
                                {nombreTipoFruta2(fruta, tiposFruta) || "Fruta desconocida"}
                            </div>
                            <div className="cuarto-frio-card__fruta-quantities">
                                <div className="cuarto-frio-card__quantity cuarto-frio-card__quantity--cajas">
                                    <span className="cuarto-frio-card__quantity-number">{cantidades?.cajas || 0}</span>
                                    <span>cajas</span>
                                </div>
                                <div className="cuarto-frio-card__quantity cuarto-frio-card__quantity--kilos">
                                    <span className="cuarto-frio-card__quantity-number">{cantidades?.kilos || 0}</span>
                                    <span>kg</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}