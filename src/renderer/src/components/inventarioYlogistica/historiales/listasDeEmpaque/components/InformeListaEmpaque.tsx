/* eslint-disable prettier/prettier */
import TablaInfoListaEmpaque from "./TablaInfoListaEmpaque"
import TablaCalidadesInfo from "./TablaCalidadesInfo"
import { mostrar_CoC } from "../functions/ggn"
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore"
import { nombreTipoFruta2 } from "@renderer/utils/tipoFrutas"
import logo from '@renderer/assets/1.webp'
import { itemPalletType } from "@renderer/types/contenedores/itemsPallet"
import { formatearFecha } from "@renderer/functions/fechas"

type propsType = {
    items: itemPalletType[]
    final: boolean
}
export default function InformeListaEmpaque({ items, final }: propsType): JSX.Element {
    const tipoFrutas = useTipoFrutaStore(state => state.tiposFruta)
    return (
        <div className="historiales-listaempaque-info-container" id="view_informe_lista_empaque">
            <section >
                <div className="historiales-listaempaque-info-cabecera">
                    <img src={logo} />
                    <h2>PACKING LIST REPORT</h2>
                    <p>Codigo: PC-CAL-FOR-05</p>
                </div>
                <hr />
                <div className="historiales-listaempaque-info-cabecera">
                    <p>{(items[0]?.contenedor?.infoContenedor?.clienteInfo?.CLIENTE || "")}</p>
                    <p>TEMP. SET POINT: 44,6F</p>
                    <p>FREIGHT:</p>
                    <p>CONTAINER NUMBER: {items[0]?.contenedor?.numeroContenedor}</p>
                </div>
                <div className="historiales-listaempaque-info-cabecera">
                    <p>REFERENCE N°:</p>
                    <p>{items[0]?.contenedor?.infoContenedor?.tipoFruta.reduce((acu, item) => acu + (nombreTipoFruta2(item, tipoFrutas) + " - " || ""), "")}</p>
                    <p>TEMP RECORDER LOCATION: PALLET 10</p>
                    <p>TEMP RECORDER ID: SS-0085719</p>
                    <p>
                        {"DATE: " + formatearFecha(items[0]?.contenedor?.infoContenedor?.fechaCreacion || "")}
                    </p>
                    <p>CoC: {mostrar_CoC(items) ? "4063061801296" : "N/A"}</p>
                </div>
                <hr />

            </section>
            <TablaInfoListaEmpaque
                final={final}
                items={items} />
            {items[0] && items[0].contenedor.infoContenedor.calidad.map(cal => (
                <div key={cal}>
                    <TablaCalidadesInfo items={items} calidad={cal} />
                </div>
            ))}

        </div>
    )
}
