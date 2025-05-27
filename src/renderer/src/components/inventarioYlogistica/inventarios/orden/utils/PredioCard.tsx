/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import { BsArrowRightSquareFill } from "react-icons/bs";
import { formatearFecha } from "@renderer/functions/fechas";
import { useEffect, useState } from "react";

type propsType = {
    lote: lotesType
    handleAddOrdenVaceo: (_id) => void
}

export default function PredioCard(props: propsType): JSX.Element {
    const [exportacion, setExportacion] = useState<number>()
    const [descarte, setDescarte] = useState<number>()
    useEffect(() => {
        if (props.lote.calidad && props.lote.calidad.inspeccionIngreso) {
            let des = 0;
            let exp = 0;
            for (const [key, value] of Object.entries(props.lote.calidad?.inspeccionIngreso)) {
                if(key === 'exportacion1' || key === 'exportacion15' || key === 'exportacion2'){
                    exp += Number(value)
                } else if(key !== 'fecha') {
                    des += Number(value)
                }
            }
            setExportacion(exp * 100)
            setDescarte(des * 100)
        }
    }, [props.lote])
    return (
        <div className="predio-card-grid">
            <div className="grid-main-info">
                <span className="enf">{props.lote.enf}</span>
                <span className="predio">{props.lote.predio?.PREDIO}</span>
                <span>{props.lote.tipoFruta}</span>
            </div>
            <div className="grid-extra-info">
                <span>{formatearFecha(props.lote.fecha_ingreso_inventario)}</span>

                <span>Can: {Number(props.lote?.inventario)}</span>
                <span>{(Number(props.lote?.inventario) * Number(props.lote.promedio)).toFixed(0)} Kg</span>
                {Object.prototype.hasOwnProperty.call(props.lote, "desverdizado") && (
                    <span className="tag-desverdizado">Desverdizado</span>
                )}
            </div>
            <div className="grid-stats">
                <span className="exportacion">
                    Exp: <b>{exportacion?.toFixed(2)}%</b>
                </span>
                <span className="descarte">
                    Des: <b>{descarte?.toFixed(2)}%</b>
                </span>
                <span>GGN: {props.lote.GGN && props.lote.predio.GGN.code}</span>

            </div>
            <div className="grid-action">
                <button className="boton-accion" onClick={():void => props.handleAddOrdenVaceo(props.lote._id)}>
                    <BsArrowRightSquareFill size={28} />
                </button>
            </div>
        </div>
    )
}
