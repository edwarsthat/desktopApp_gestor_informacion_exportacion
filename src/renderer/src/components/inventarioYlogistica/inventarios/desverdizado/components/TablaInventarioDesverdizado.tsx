/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas"
import { itemInventarioType } from "../validations/types"

type propsType = {
    data: itemInventarioType[]
    handleSelect: (lote: itemInventarioType) => void
}

const headers = ["", "EF1", "Nombre del predio", "Canastillas", "Kilos", "Cuarto Desverdizado", "GGN", "Fecha Ingreso"]

export default function TablaInventarioDesverdizado(props: propsType): JSX.Element {
    return (
        <div className="table-container">
            <table className="table-main">
                <thead>
                    <tr>
                        {headers.map(item => <th key={item}>{item}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((item, index) => (
                        <tr key={item._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                            <td>
                                <input
                                    onClick={(): void => props.handleSelect(item)}
                                    type="radio"
                                    id={item._id}
                                    name='lote' />
                            </td>
                            <td>{item?.enf || ""}</td>
                            <td>{item?.lote || ""}</td>
                            <td>{item?.canastillas || 0}</td>
                            <td>{((parseInt(item?.canastillas) || 0) * (item?.promedio || 0)).toFixed(2)} Kg</td>
                            <td>{item?.cuarto || ""}</td>
                            <td>{item.GGN}</td>
                            <td>
                                {formatearFecha(item?.fechaIngreso ?? '')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

