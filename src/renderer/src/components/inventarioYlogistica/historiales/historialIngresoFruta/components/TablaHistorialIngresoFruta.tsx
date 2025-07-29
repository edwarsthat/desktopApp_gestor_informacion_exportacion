/* eslint-disable prettier/prettier */
import { PiNotePencilDuotone } from "react-icons/pi";
import { TABLE_COLUMNS_INGRESOS } from "../constants/table";
import { loteEF8Type } from "@renderer/types/loteEf8";
import { lotesType } from "@renderer/types/lotesType";

type propsType = {
    data: (lotesType | loteEF8Type)[] | undefined
    setOpenModal: (e) => void
    setOpenModalEf8: (e) => void
    setLoteSeleccionado: (lote) => void
}
export default function TablaHistorialIngresoFruta(props: propsType): JSX.Element {
    if (props.data === undefined) return <div>Cargando...</div>
    const headers = ["EF1", "Predio", "Numero de canastillas", "Kilos", "Fecha creación", "Fecha estimada de llegada", "Tipo de fruta", "GGN", "Observaciones", "Placa", "User", ""]
    const handleButton = (lote): void => {
        props.setLoteSeleccionado(lote)
        if (!('documento' in lote)) {
            props.setOpenModalEf8(true)
        } else {
            props.setOpenModal(true)
        }
    }
    return (
        <div className="table-container">
            <table className="table-main">
                <thead>
                    <tr >
                        {headers.map(item => (
                            <th key={item}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((lote, index) => (
                        <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={lote._id} >
                            <>
                                {typeof lote === 'object' && Object.hasOwnProperty.call(lote, "kilos") ? (
                                    TABLE_COLUMNS_INGRESOS.ef1.map(col => (
                                        <td key={col.header + index}>{col.value(lote as lotesType)}</td>
                                    ))
                                ) : (
                                    TABLE_COLUMNS_INGRESOS.ef8.map(col => (
                                        <td key={col.header + index}>{col.value(lote as loteEF8Type)}</td>
                                    ))
                                )}
                            </>
                            <td>
                                <button style={{ color: "blue" }} onClick={(): void => handleButton(lote)} ><PiNotePencilDuotone /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}