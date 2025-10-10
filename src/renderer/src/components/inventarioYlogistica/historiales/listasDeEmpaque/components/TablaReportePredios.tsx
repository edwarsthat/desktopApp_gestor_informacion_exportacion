/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react"
import { resumenPredios, resumenPrediosClientes, resumenPredioType } from "../functions/reportePredios"
import { itemPalletType } from "@renderer/types/contenedores/itemsPallet"

type propsType = {
    items: itemPalletType[] | undefined
    final: boolean
    setDataToExcel: (e) => void
}

const headers = [
    "Predio",
    "Codigo ICA",
    "N° Cajas",
    "Peso Neto",
    "Peso Bruto"
]

export default function TablaReportePredios({ items, final, setDataToExcel }: propsType): JSX.Element {
    const [info, setInfo] = useState<resumenPredioType>()
    const [totalCajas, setTotalCajas] = useState<number>();
    const [pesoTotal, setPesoTotal] = useState<number>();
    useEffect(() => {
        if (items !== undefined) {
            const infoTabla = resumenPredios(items);
            console.log(infoTabla)
            if(final){
                console.log(infoTabla)
                // infoTabla = resumenPrediosClientes(
                //     infoTabla[0], props.proveedores
                // )
            }
            setInfo(infoTabla[0])
            setTotalCajas(infoTabla[1])
            setPesoTotal(infoTabla[2])
            setDataToExcel(infoTabla)
        }
    }, [final])

    if(info === undefined){
        return(
            <div>Cargando datos...</div>
        )
    }
    return (
        <table className="table-main-informe-proveedor" id="tabla_reporte_predios_lista_empaque">
            <thead>
                <tr>
                    {headers.map(item => (
                        <th key={item}>{item}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                    {Object.entries(info).map(([key, value], index) => (
                        <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={key}>
                            <td>{value.predio}</td>
                            <td>{value.SISPAP ? value.ICA : "SIN SIPAP"}</td>
                            <td>{value.cajas}</td>
                            <td>{value.peso} Kg</td>
                            <td>{value.peso + (0.85 * value.cajas)} Kg</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={2}>TOTAL:</td>
                        <td>{totalCajas}</td>
                        <td>{pesoTotal?.toLocaleString('es-Co')} Kg</td>
                        <td>{((pesoTotal ? pesoTotal : 0 ) + (totalCajas ? totalCajas * 0.85  : 0))} Kg</td>
                    </tr>
            </tbody>
        </table>
    )
}
