/* eslint-disable prettier/prettier */

import { despachoDescartesType } from "@renderer/types/despachoDescartesType"
import { formatearFecha } from "@renderer/functions/fechas";
import { PiNotePencilDuotone } from "react-icons/pi";
import { useState } from "react";
import ModalModificarHistorialDespacho from "./ModalModificarHistorialDespacho";

type propsType = {
    data: despachoDescartesType[] | undefined
    obtenerData: () => Promise<void>
}

export default function TablaHistorialDespachoDescarte(props: propsType): JSX.Element {
    const headers = ['Fecha', 'cliente', 'Placa', 'Conductor', 'Telefono', 'Cedula', 'Remisión', 'kilos', 'Tipo fruta', 'usuario', '']
    const [open, setOpen] = useState<boolean>(false)
    const [registroSelected, setRegistroSelected] = useState<despachoDescartesType>()
    if (props.data === undefined) {
        return (
            <div>Cargando datos...</div>
        )
    }
    return (
        <div className="table-container">
            <div>
            <table className="table-main">
                <thead>
                    <tr>
                        {headers.map(item => (
                            <th key={item}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((item, index) => (
                        <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={item._id} >

                            <td>{formatearFecha(item.fecha, true)}</td>
                            <td>{item.cliente && (item.cliente.cliente ?? item.cliente)}</td>
                            <td>{item.placa}</td>
                            <td>{item.nombreConductor}</td>
                            <td>{item.telefono}</td>
                            <td>{item.cedula}</td>
                            <td>{item.remision}</td>
                            <td>{item.kilos ?? ''}</td>
                            <td>{item.tipoFruta}</td>
                            <td>{item.user}</td>
                            <td>
                                <div 
                                    onClick={():void => {
                                        setOpen(true)
                                        setRegistroSelected(item)
                                    }}
                                    style={{ color: 'blue' }}>
                                        < PiNotePencilDuotone/>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
</div>
        </ div>
    )
}
