/* eslint-disable prettier/prettier */

import { tipoCalidad } from "@renderer/utils/tipoFrutas";
import { porcentajeCalibreLotes } from "../services/procesarData";
import { filtroExportacionesSelectType, totalesLotesType } from "../validations/types";
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";


type propsType = {
    totalLotes: totalesLotesType;
    filtrosCalidad: string[];
    filtrosCalibre: string[];
    selectFiltroExportacion: filtroExportacionesSelectType

}

export default function TablasRendimientoPredios({
    totalLotes, filtrosCalidad, filtrosCalibre, selectFiltroExportacion }: propsType): JSX.Element {
    const header = ["Totales", "Kilos", "Porcentaje"]
    const tiposFruta = useTipoFrutaStore(state => state.tiposFruta)
    if (selectFiltroExportacion.calidad) {
        return (
            <table className="table-main"
                onContextMenu={(e): void => {
                    e.preventDefault();
                    window.api.mostrarMenuTabla();
                }}
            >
                <thead>
                    <tr>
                        {header.map(col => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr className={'fondo-impar'}>
                        <td>Kilos Ingresados</td>
                        <td>{totalLotes.totalKilosIngreso.toLocaleString('es-CO')}</td>
                        <td>100%</td>
                    </tr>
                    <tr className={'fondo-par'}>
                        <td>Procesados</td>
                        <td>{totalLotes.totalKilosProcesados.toLocaleString('es-CO')}</td>
                        <td>{totalLotes.totalKilosProcesados > 0 ? ((totalLotes.totalKilosProcesados / totalLotes.totalKilosIngreso) * 100).toFixed(2) + '%' : '0%'}</td>
                    </tr>
                    {Object.entries(totalLotes.calidades || {}).map(([key, value]) => {
                        if(filtrosCalidad.includes(key)) {
                            return (
                                <tr className={'fondo-impar'} key={key + value + "tablaPredioIndicador"}>
                                    <td>{tipoCalidad(key, tiposFruta)}</td>
                                    <td>{value.toLocaleString('es-CO')}</td>
                                    <td>{value > 0 ? ((value / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                                </tr>
                            )
                        } else {
                            return null
                        }
                    })}

                    <tr className={'fondo-par'}>
                        <td>Descartes</td>
                        <td>{totalLotes.totalKilosDescarte.toLocaleString('es-CO')}</td>
                        <td>{totalLotes.totalKilosDescarte > 0 ? ((totalLotes.totalKilosDescarte / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                    </tr>
                    <tr className={'fondo-impar'}>
                        <td>Deshidratacion</td>
                        <td>{(totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalKilosExportacion)).toLocaleString('es-CO')}</td>
                        <td>{(totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalKilosExportacion)) > 0 ? (((totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalKilosExportacion)) / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                    </tr>
                </tbody>
            </table>
        )
    }
    else if (selectFiltroExportacion.calibre) {
        return (
            <table className="table-main"
                onContextMenu={(e): void => {
                    e.preventDefault();
                    window.api.mostrarMenuTabla();
                }}
            >
                <thead>
                    <tr>
                        {header.map(col => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr className={'fondo-impar'}>
                        <td>Kilos Ingresados</td>
                        <td>{totalLotes.totalKilosIngreso.toLocaleString('es-CO')}</td>
                        <td>100%</td>
                    </tr>
                    <tr className={'fondo-par'}>
                        <td>Procesados</td>
                        <td>{totalLotes.totalKilosProcesados.toLocaleString('es-CO')}</td>
                        <td>{totalLotes.totalKilosProcesados > 0 ? ((totalLotes.totalKilosProcesados / totalLotes.totalKilosIngreso) * 100).toFixed(2) + '%' : '0%'}</td>
                    </tr>
                    {filtrosCalibre.map((calibre, index) => (
                        <tr className={'fondo-impar'} key={calibre + index}>
                            <td>{calibre}</td>
                            <td>{totalLotes.calibresTotal[calibre]?.kilos.toLocaleString('es-CO')}</td>
                            <td>{porcentajeCalibreLotes(totalLotes, calibre) || "0%"}</td>
                        </tr>
                    ))}
                    <tr className={'fondo-par'}>
                        <td>Descartes</td>
                        <td>{totalLotes.totalKilosDescarte.toLocaleString('es-CO')}</td>
                        <td>{totalLotes.totalKilosDescarte > 0 ? ((totalLotes.totalKilosDescarte / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                    </tr>
                    <tr className={'fondo-impar'}>
                        <td>Deshidratacion</td>
                        <td>{(totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalKilosExportacion)).toLocaleString('es-CO')}</td>
                        <td>{(totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalKilosExportacion)) > 0 ? (((totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalKilosExportacion)) / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                    </tr>
                </tbody>
            </table>
        )
    }
    return (
        <table className="table-main"
            onContextMenu={(e): void => {
                e.preventDefault();
                window.api.mostrarMenuTabla();
            }}
        >
            <thead>
                <tr>
                    {header.map(col => (
                        <th key={col}>{col}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr className={'fondo-impar'}>
                    <td>Kilos Ingresados</td>
                    <td>{totalLotes.totalKilosIngreso.toLocaleString('es-CO')}</td>
                    <td>100%</td>
                </tr>
                <tr className={'fondo-par'}>
                    <td>Procesados</td>
                    <td>{totalLotes.totalKilosProcesados.toLocaleString('es-CO')}</td>
                    <td>{totalLotes.totalKilosProcesados > 0 ? ((totalLotes.totalKilosProcesados / totalLotes.totalKilosIngreso) * 100).toFixed(2) + '%' : '0%'}</td>
                </tr>
                <tr className={'fondo-impar'}>
                    <td>Exportacion</td>
                    <td>{totalLotes.totalKilosExportacion.toLocaleString('es-CO')}</td>
                    <td>{totalLotes.totalKilosExportacion > 0 ? ((totalLotes.totalKilosExportacion / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                </tr>
                <tr className={'fondo-par'}>
                    <td>Descartes</td>
                    <td>{totalLotes.totalKilosDescarte.toLocaleString('es-CO')}</td>
                    <td>{totalLotes.totalKilosDescarte > 0 ? ((totalLotes.totalKilosDescarte / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                </tr>
                <tr className={'fondo-impar'}>
                    <td>Deshidratacion</td>
                    <td>{(totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalKilosExportacion)).toLocaleString('es-CO')}</td>
                    <td>{(totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalKilosExportacion)) > 0 ? (((totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalKilosExportacion)) / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                </tr>
            </tbody>
        </table>
    )
}