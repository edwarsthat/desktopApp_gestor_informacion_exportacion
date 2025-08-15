/* eslint-disable prettier/prettier */
import { formatearFecha } from "@renderer/functions/fechas";
import { contenedoresType } from "@renderer/types/contenedoresType";
import { proveedoresType } from "@renderer/types/proveedoresType";
import { aplicar_ggn_fecha } from "../functions/ggn";
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";
import { nombreTipoFruta2, tipoCalidad } from "@renderer/utils/tipoFrutas";

type propsType = {
    contenedor: contenedoresType
    final: boolean
    proveedores: proveedoresType[]

}

const headers = [
    "PALLET ID",
    "PACKING DATE",
    "LABEL",
    "VARIETY",
    "PRODUCT",
    "WEIGHT",
    "CATEGORY",
    "SIZE",
    "QTY",
    "FARM CODE",
    "N° GG",
    "EXPIRATION DATE"
];


export default function TablaInfoListaEmpaque({ contenedor, final }: propsType): JSX.Element {

    const tiposFrutas = useTipoFrutaStore(state => state.tiposFruta);
    const mostrarKilose = (item): string => {
        const peso = Number(item.tipoCaja.split("-")[1]);
        if (final) {
            if (peso >= 17.3) return "40LB";
            if (peso >= 14) return "37LB";
            if (peso > 4 && peso < 5) return ("4,5Kg");
        }

        return (peso + "Kg");
    }

    return (
        <table className="table-main-informe-proveedor">
            <thead>
                <tr>
                    {headers
                        .filter(item => !(item === "PRODUCT") ||
                            (final && (typeof contenedor.infoContenedor.clienteInfo === 'object' &&
                                contenedor.infoContenedor.clienteInfo._id === '659dbd9a347a42d89929340e')))
                        .map(item => (
                            <th key={item}>{item}</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {contenedor.pallets.map((_, index) => (
                    contenedor.pallets[index].EF1.map((item) => (
                        <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={index + item.fecha}>
                            <td>{index + 1}{contenedor.numeroContenedor}</td>
                            <td>{formatearFecha(item.fecha, true)}</td>
                            <td>{item.tipoCaja.split("-")[0]}</td>
                            <td>{nombreTipoFruta2(item.tipoFruta, tiposFrutas)}</td>
                            {final &&
                                (typeof contenedor.infoContenedor.clienteInfo === "object" ?
                                    contenedor.infoContenedor.clienteInfo.CLIENTE : "") === 'KONGELATO' &&
                                <td>
                                    COL-{mostrarKilose(item)}
                                    {item.tipoFruta === 'Limon' ? 'Limes' : 'Oranges'}
                                    {item.calibre}ct
                                </td>}
                            <td>{mostrarKilose(item)}</td>
                            <td>{tipoCalidad(item.calidad, tiposFrutas)}</td>
                            <td>{item.calibre}</td>
                            <td>{item.cajas}</td>
                            <td>{
                                item.SISPAP ? item.lote && item.lote.ICA && item.lote.ICA.code  : 'Sin SISPAP'
                            }</td>
                            <td>{item.GGN ? item.lote?.GGN?.code : ''}</td>
                            <td>
                                {aplicar_ggn_fecha(item, contenedor) !== "" ?
                                    formatearFecha(aplicar_ggn_fecha(item, contenedor)) : "N/A"}
                            </td>
                        </tr>
                    ))
                ))}
            </tbody>
        </table>
    )
}
