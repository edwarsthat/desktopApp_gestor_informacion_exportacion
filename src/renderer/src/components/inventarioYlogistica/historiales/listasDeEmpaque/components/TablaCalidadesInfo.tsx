/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react"
import { resumenCalidad } from "../functions/resumen"
import { itemPalletType } from "@renderer/types/contenedores/itemsPallet"
import { calidadesType } from "@renderer/types/tiposFrutas"

type propsType = {
    items: itemPalletType[]
    calidad: calidadesType
}

export default function TablaCalidadesInfo({ items, calidad }: propsType): JSX.Element {
    const [resumen, setResumen] = useState<object>()
    useEffect(() => {
        if (items !== undefined) {
            const res = resumenCalidad(items, calidad._id)
            setResumen(res)
        }
    }, [items])

    return (

            <table className="table-main">
                <thead>
                    <tr>
                        <th>SUMMARY CATEGORY</th>
                        <th>{calidad.nombre}</th>
                        <th></th>
                        <th></th>
                    </tr>
                    <tr>
                        <th>SIZE</th>
                        <th>QTY</th>
                        <th>N. PALLETS</th>
                        <th>% PERCENTAGE</th>
                    </tr>
                </thead>
                <tbody>
                    {resumen && Object.entries(resumen).map(([key, value]) => (
                        <tr key={key}>
                            <td>{key}</td>
                            <td>{value.cantidad}</td>
                            <td>{value.pallets}</td>
                            <td>{value.porcentage.toFixed(2)}%</td>
                        </tr>
                    ))}
                    <tr>
                        <td>TOTAL</td>
                        <td>{resumen && Object.keys(resumen).reduce((acu, item) => acu += resumen[item].cantidad, 0)}</td>
                        <td>{resumen && Object.keys(resumen).reduce((acu, item) => acu += resumen[item].pallets, 0)}</td>
                        <td>{resumen && Object.keys(resumen).reduce((acu, item) => acu += resumen[item].porcentage, 0).toFixed(2)}%</td>
                    </tr>
                </tbody>
            </table>
    )
}