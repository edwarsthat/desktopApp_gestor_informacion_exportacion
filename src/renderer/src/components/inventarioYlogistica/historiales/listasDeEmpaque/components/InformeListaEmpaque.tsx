/* eslint-disable prettier/prettier */
import { contenedoresType } from "@renderer/types/contenedoresType"
import TablaInfoListaEmpaque from "./TablaInfoListaEmpaque"
import TablaCalidadesInfo from "./TablaCalidadesInfo"
import { proveedoresType } from "@renderer/types/proveedoresType"
import { mostrar_CoC } from "../functions/ggn"
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore"
import { nombreTipoFruta2 } from "@renderer/utils/tipoFrutas"
import logo from '@renderer/assets/1.webp'

type propsType = {
    contenedor: contenedoresType
    final: boolean
    proveedores: proveedoresType[]
}
export default function InformeListaEmpaque({ contenedor, final, proveedores }: propsType): JSX.Element {
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
                    <p>{(typeof contenedor.infoContenedor.clienteInfo === "object" ?
                        contenedor.infoContenedor.clienteInfo.CLIENTE : "")}</p>
                    <p>TEMP. SET POINT: 44,6F</p>
                    <p>FREIGHT:</p>
                    <p>CONTAINER NUMBER: {contenedor.numeroContenedor}</p>
                </div>
                <div className="historiales-listaempaque-info-cabecera">
                    <p>REFERENCE N°:</p>
                    <p>{contenedor.infoContenedor.tipoFruta.reduce((acu, item) => acu + (nombreTipoFruta2(item, tipoFrutas) + " - " || ""), "")}</p>
                    <p>TEMP RECORDER LOCATION: PALLET 10</p>
                    <p>TEMP RECORDER ID: SS-0085719</p>
                    <p>
                        {"DATE: " +
                            new Date(contenedor.infoContenedor.fechaCreacion).toDateString()}
                    </p>
                    <p>CoC: {mostrar_CoC(contenedor) ? "4063061801296" : "N/A"}</p>
                </div>
                <hr />

            </section>
            <TablaInfoListaEmpaque
                proveedores={proveedores}
                final={final}
                contenedor={contenedor} />
            <section className="historiales-listaempaque-info-resumen">
                {contenedor.infoContenedor.calidad.map(calidad => (
                    <div key={calidad}>
                        <TablaCalidadesInfo calidad={calidad} contenedor={contenedor} />
                    </div>
                ))}
            </section>
        </div>
    )
}
