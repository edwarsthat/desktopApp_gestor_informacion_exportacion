/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react"
import { costoContenedorData } from "../types"
import { tipoCalidad } from "@renderer/utils/tipoFrutas"
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore"
import "../styles/CostoContenedoresInfo.css"

type propsType = {
    data: costoContenedorData
    totalCalidad: { [calidad: string]: number }
    setShowData: (show: boolean) => void
}

export default function CostoContenedoresInfo({ data, totalCalidad, setShowData }: propsType): JSX.Element {
    const tipoFrutas = useTipoFrutaStore(state => state.tiposFruta);
    const [isOne, setIsOne] = useState<boolean>(false);
    const [calidades, setCalidades] = useState<string[]>([]);
    const contenedores = Object.keys(data) || [];

    const totalGeneral = Object.values(totalCalidad).reduce((acc, valor) => acc + Number(valor), 0);

    useEffect(() => {
        if (Object.keys(data).length > 1) {
            Object.keys(data).forEach(contenedor => {
                const calidadesContenedor = Object.keys(data[contenedor]).map(calidad => calidad)
                setCalidades(prev => [...new Set([...prev, ...calidadesContenedor])])
            })
            setIsOne(false)
        } else {
            Object.keys(data).forEach(contenedor => {
                const calidadesContenedor = Object.values(data[contenedor]).map(enf => Object.keys(enf)).flat()
                setCalidades(prev => [...new Set([...prev, ...calidadesContenedor])])
            })
            setIsOne(true)
            console.log(data)
            console.log(totalCalidad)
        }

    }, [data])

    return (
        <div className="contenedores-info-wrapper">

            <div className="historial-listasempaque-busqueda">
                <button onClick={(): void => setShowData(false)} className="defaulButtonAgree">Volver a buscar</button>
            </div>
            <div className="contenedores-header">
                <h3 className="contenedores-title">
                    <span className="title-label">Contenedores:</span>
                    <span className="contenedores-list">{contenedores.join(" • ")}</span>
                </h3>
            </div>
            <div className="table-container">
                <table className="table-main">
                    <thead>
                        <tr >
                            <th>{isOne ? "Enf" : "Contenedor"}</th>
                            {calidades.map(item => (
                                <th key={item}>{tipoCalidad(item, tipoFrutas)}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isOne ?
                            Object.entries(data[contenedores[0]]).map(([enf, caliadEnf], index) => (
                                <tr key={enf} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}  >
                                    <td>{enf}</td>
                                    {Object.keys(totalCalidad).map((calidad, index) => (
                                        <td key={index}>
                                            {new Intl.NumberFormat("es-CO", {
                                                style: "currency",
                                                currency: "COP",
                                                minimumFractionDigits: 0
                                            }).format(Number(caliadEnf[calidad] || 0))}
                                        </td>
                                    ))}
                                </tr>
                            ))
                            :
                            Object.entries(data).map(([contenedor, calidades], index) => (
                                <tr key={contenedor + index} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}  >
                                    <td>{contenedor}</td>
                                    {Object.keys(totalCalidad).map((calidad, index) => (
                                        <td key={index}>
                                            {new Intl.NumberFormat("es-CO", {
                                                style: "currency",
                                                currency: "COP",
                                                minimumFractionDigits: 0
                                            }).format(Number(calidades[calidad] || 0))}
                                        </td>
                                    ))}
                                </tr>))
                        }
                        <tr className="total_row">
                            <td><strong>Total</strong></td>
                            {Object.keys(totalCalidad).length > 0 && Object.entries((totalCalidad)).map(([calidad, valor]) => (
                                <td key={calidad}>
                                    {new Intl.NumberFormat("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                        minimumFractionDigits: 0
                                    }).format(Number(valor))}
                                </td>
                            ))}
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
                        }).format(totalGeneral)}
                    </span>
                </div>
            </div>
        </div>
    )
}