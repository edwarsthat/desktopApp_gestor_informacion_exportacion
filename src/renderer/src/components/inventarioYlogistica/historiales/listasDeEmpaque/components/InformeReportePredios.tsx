/* eslint-disable prettier/prettier */
import { formatearFecha } from "@renderer/functions/fechas"
import imagenCelifrut from "../../../../../assets/CELIFRUT.png"
import TablaReportePredios from "./TablaReportePredios"
import { itemPalletType } from "@renderer/types/contenedores/itemsPallet"

type propsType = {
    items: itemPalletType[]
    final: boolean
    setDataToExcel: (e) => void

}
export default function InformeReportePredios({ items, final, setDataToExcel }: propsType): JSX.Element {
    return (
        <div className="historiales-listaempaque-info-container" id="view_informe_resporte_predios">
            <section >
                <div 
                    className="historiales-listaempaque-info-cabecera"
                    id="header_view_informe_reporte_predios"
                >
                    <img src={imagenCelifrut} />
                    <h2>REPORTE POR PREDIO ICA</h2>
                    <p>Codigo: PC-CAL-FOR-04
                        Versión: 03
                        Fecha: 17 Oct 2020
                    </p>
                </div>
                <hr />
                <div className="historiales-listaempaque-info-cabecera">
                    <p>CLIENTE:</p>
                    <p>{items[0]?.contenedor?.infoContenedor?.clienteInfo?.CLIENTE || ""}</p>

                </div>
                <div className="historiales-listaempaque-info-cabecera">
                    <p>FECHA:</p>
                    <p>{formatearFecha(items[0]?.contenedor?.infoContenedor?.fechaCreacion || "")}</p>

                </div>
                <hr />
            </section>
            <TablaReportePredios
                setDataToExcel={setDataToExcel}
                final={final} 
                items={items} />
        </div>
    )
}