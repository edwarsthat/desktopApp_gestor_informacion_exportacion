/* eslint-disable prettier/prettier */
import { formatearFecha } from "@renderer/functions/fechas";
import { aplicar_ggn_fecha } from "../functions/ggn";
import { itemPalletType } from "@renderer/types/contenedores/itemsPallet";

type propsType = {
    items: itemPalletType[]
    final: boolean

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


export default function TablaInfoListaEmpaque({ items, final }: propsType): JSX.Element {

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
                            (final && (items[0]?.contenedor?.infoContenedor?.clienteInfo?._id === '659dbd9a347a42d89929340e')))
                        .map(item => (
                            <th key={item}>{item}</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => (
                    <tr className={`${ item.pallet.numeroPallet % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={index + item._id}>
                        <td>{item.pallet.numeroPallet}{item?.contenedor?.numeroContenedor || ""}</td>
                        <td>{formatearFecha(item.fecha, true)}</td>
                        <td>{item.tipoCaja.split("-")[0]}</td>
                        <td>{item?.tipoFruta?.tipoFruta || ''}</td>
                        {final &&
                            (item?.contenedor?.infoContenedor?.clienteInfo?.CLIENTE || "") === 'KONGELATO' &&
                            <td>
                                COL-{mostrarKilose(item)}
                                {item.tipoFruta.tipoFruta === 'Limon' ? 'Limes' : 'Oranges'}
                                {item.calibre}ct
                            </td>}
                        <td>{mostrarKilose(item)}</td>
                        <td>{item.calidad.nombre}</td>
                        <td>{item.calibre}</td>
                        <td>{item.cajas}</td>
                        <td>{
                            item.SISPAP ? item.lote && item.lote.predio.ICA && item.lote.predio.ICA.code : 'Sin SISPAP'
                        }</td>
                        <td>{item.lote.predio.GGN ? item.lote?.predio.GGN?.code : ''}</td>
                        <td>
                            {aplicar_ggn_fecha(item) !== "" ?
                                formatearFecha(aplicar_ggn_fecha(item)) : "N/A"}
                        </td>
                    </tr>

                ))}
            </tbody>
        </table>
    )
}
