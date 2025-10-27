/* eslint-disable prettier/prettier */

import React, { useEffect } from "react"
import { costoContenedorData } from "../types"
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore"
import "../styles/CostoContenedoresInfo.css"

type propsType = {
    data: costoContenedorData[]
    tipo: string
    setShowData: (show: boolean) => void
}

export default function CostoContenedoresInfo({ data, setShowData, tipo }: propsType): JSX.Element {
    const tiposFruta = useTipoFrutaStore(state => state.tiposFruta);
    const calidadesExpt = useTipoFrutaStore(state => state.tiposCalidades);
    const [totalTipoFruta, setTotalTipoFruta] = React.useState<Record<string, { totalPrecio: number, totalKilos: number }>>({});

    const { totalPrecio, totalKilos } = (data ?? []).reduce((acc, item) => {
        for (const v of Object.values(item)) {
            if (v && typeof v === 'object') {
                acc.totalPrecio += (+v.precio || 0);
                acc.totalKilos += (+v.kilos || 0);
            }
        }
        return acc;
    }, { totalPrecio: 0, totalKilos: 0 });

    useEffect(() => {
        // Calcular total por tipo de fruta
        const totalesPorTipoFruta: Record<string, { totalPrecio: number, totalKilos: number }> = {};

        (data ?? []).forEach(item => {
            Object.keys(item).forEach(key => {
                if (key !== '_id' && key !== 'nombre' && key !== 'tipoFruta') {
                    const tipoFruta = calidadesExpt.find(calidad => calidad._id === key)?.tipoFruta?._id || key;
                    if (!tipoFruta) return;

                    if (!totalesPorTipoFruta[tipoFruta as string]) {
                        totalesPorTipoFruta[tipoFruta as string] = {
                            totalPrecio: 0,
                            totalKilos: 0
                        };
                    }
                    totalesPorTipoFruta[tipoFruta as string].totalPrecio += (+item[key].precio || 0);
                    totalesPorTipoFruta[tipoFruta as string].totalKilos += (+item[key].kilos || 0);

                }
            })

        });

        setTotalTipoFruta(totalesPorTipoFruta);
    }, [data, tipo])

    if (!data || data.length === 0) {
        return <div className="historial-listasempaque-busqueda">
            <button onClick={(): void => setShowData(false)} className="defaulButtonAgree">Volver a buscar</button>
        </div>
    }

    return (
        <div className="contenedores-info-wrapper">

            <div className="historial-listasempaque-busqueda">
                <button onClick={(): void => setShowData(false)} className="defaulButtonAgree">Volver a buscar</button>
            </div>
            <div className="contenedores-header">
                <h3 className="contenedores-title">
                    <span className="title-label">Contenedores:</span>
                    <span className="contenedores-list">{ }</span>
                </h3>
            </div>
            <div className="table-container">
                <table className="table-main">
                    <thead>
                        <tr >
                            <th>{tipo === 'lote' ? "Enf" : "Contenedor"}</th>
                            <th>{tipo === 'lote' ? "Predio" : "Cliente"}</th>
                            {Object.keys(data[0] || {}).map(item => {
                                if (item === "_id" || item === "nombre" || item === "tipoFruta") return null;
                                return <React.Fragment key={item + "headercalidad"}>
                                    <th >{calidadesExpt.find(calidad => calidad._id === item)?.nombre || item} Kg</th>
                                    <th >{calidadesExpt.find(calidad => calidad._id === item)?.nombre || item} Costo</th>
                                </React.Fragment>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {tipo ?
                            (data || []).map((item, index) => (
                                <tr key={item._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}  >
                                    <td>{item._id}</td>
                                    <td>{item.nombre}</td>
                                    {Object.keys(item).map((calidad, index) => {
                                        if (calidad === "_id" || calidad === "nombre" || calidad === "tipoFruta") return null;
                                        return <React.Fragment key={index}>
                                            <td >
                                                {Number(item[calidad].kilos || 0).toFixed(2)}
                                            </td>
                                            <td >
                                                {new Intl.NumberFormat("es-CO", {
                                                    style: "currency",
                                                    currency: "COP",
                                                    minimumFractionDigits: 0
                                                }).format(Number(item[calidad].precio || 0))}
                                            </td>
                                        </React.Fragment>
                                    })}
                                </tr>
                            ))
                            : null
                            // Object.entries(data).map(([contenedor, calidades], index) => (
                            //     <tr key={contenedor + index} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}  >
                            //         <td>{contenedor}</td>
                            //         {Object.keys(totalCalidad).map((calidad, index) => (
                            //             <td key={index}>
                            //                 {new Intl.NumberFormat("es-CO", {
                            //                     style: "currency",
                            //                     currency: "COP",
                            //                     minimumFractionDigits: 0
                            //                 }).format(Number(calidades[calidad] || 0))}
                            //             </td>
                            //         ))}
                            //     </tr>))
                        }
                        <tr className="total_row">
                            <td><strong>Total</strong></td>
                            <td><strong></strong></td>
                            {Object.keys(data[0] || {}).map((calidad) => {
                                if (calidad === "_id" || calidad === "nombre" || calidad === "tipoFruta") return null;
                                return <React.Fragment key={calidad + "totalcalidad"}>
                                    <td>
                                        {(data || []).reduce((acu, item) => acu += Number(item[calidad]?.kilos || 0), 0).toFixed(2)}
                                    </td>
                                    <td>
                                        {new Intl.NumberFormat("es-CO", {
                                            style: "currency",
                                            currency: "COP",
                                            minimumFractionDigits: 0
                                        }).format((data || []).reduce((acu, item) => acu += Number(item[calidad]?.precio || 0), 0))}
                                    </td>
                                </React.Fragment>
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="total-general-section">
                <div className="total-general-card">
                    <span className="total-label">Total General:</span>
                    <span className="total-value">
                        {new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0
                        }).format(totalPrecio)}
                    </span>
                    <span className="total-label">Promedio General:</span>
                    <span className="total-value">
                        {(totalPrecio / (totalKilos) || 0).toFixed(0)} COP/Kg
                    </span>
                </div>
            </div>

            {Object.keys(totalTipoFruta).length > 0 && (
                <div className="totales-por-fruta-section">
                    <h3 className="totales-por-fruta-title">Totales y Promedios por Tipo de Fruta</h3>
                    <div className="totales-por-fruta-grid">
                        {Object.entries(totalTipoFruta).map(([tipoFruta, valores]) => (
                            <div key={tipoFruta} className="fruta-card">
                                <h4 className="fruta-card-title">
                                    {tiposFruta.find(tf => tf._id === tipoFruta)?.tipoFruta || tipoFruta}
                                </h4>
                                <div className="fruta-card-row">
                                    <span className="fruta-label">Total:</span>
                                    <span className="fruta-value">
                                        {new Intl.NumberFormat("es-CO", {
                                            style: "currency",
                                            currency: "COP",
                                            minimumFractionDigits: 0
                                        }).format(valores.totalPrecio)}
                                    </span>
                                </div>
                                <div className="fruta-card-row">
                                    <span className="fruta-label">Kilos:</span>
                                    <span className="fruta-value">
                                        {valores.totalKilos.toFixed(2)} Kg
                                    </span>
                                </div>
                                <div className="fruta-card-row">
                                    <span className="fruta-label">Promedio:</span>
                                    <span className="fruta-value highlight">
                                        {new Intl.NumberFormat("es-CO", {
                                            style: "currency",
                                            currency: "COP",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(valores.totalPrecio / valores.totalKilos || 0)}/Kg
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}