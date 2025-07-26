/* eslint-disable prettier/prettier */

import { format } from "date-fns"
import { registrosType } from "../type/type"
import { es } from 'date-fns/locale';
import { tiposFrutasType } from "@renderer/types/tiposFrutas";
import { nombreTipoFruta2 } from "@renderer/utils/tipoFrutas";

type propsType = {
    data: registrosType[]
    tipoFruta2: tiposFrutasType[]
}
export default function TablaVolantecalidad(props: propsType): JSX.Element {
    const headers = ["Nombre", "Apellido", "Tipo fruta", "Unidades revisadas", "Numero de defectos", "Calibre", "Fecha"]
    return (
        <div className="table-container">
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
                        <tr key={index + item._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                            <td>
                                {item.operario.nombre}
                            </td>
                            <td>
                                {item.operario.apellido}
                            </td>
                            <td>
                                {nombreTipoFruta2(item.tipoFruta, props.tipoFruta2)}
                            </td>
                            <td>
                                {item.unidades}
                            </td>
                            <td>
                                {item.defectos}
                            </td>
                            <td>
                                {item?.calibre || ""}
                            </td>
                            <td>
                                {format(item.fecha ? new Date(item.fecha) : new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    )
}
