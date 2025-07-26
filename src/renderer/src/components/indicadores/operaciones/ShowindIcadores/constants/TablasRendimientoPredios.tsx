/* eslint-disable prettier/prettier */

import { porcentajeCalibreLotes } from "../services/procesarData";
import { filtroExportacionesSelectType, totalesLotesType } from "../validations/types";


type propsType = {
    totalLotes: totalesLotesType;
    filtrosCalidad: string[];
    filtrosCalibre: string[];
    selectFiltroExportacion: filtroExportacionesSelectType

}

export default function TablasRendimientoPredios({
    totalLotes, filtrosCalidad, filtrosCalibre, selectFiltroExportacion }: propsType): JSX.Element {
    const header = ["Totales", "Kilos", "Porcentaje"]

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
                    {filtrosCalidad.includes("calidad1") && (
                        <tr className={'fondo-impar'}>
                            <td>Calidad 1</td>
                            <td>{totalLotes?.totalCalidad1 || 0}</td>
                            <td>{totalLotes.totalCalidad1 > 0 ? ((totalLotes.totalCalidad1 / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                        </tr>
                    )}
                    {filtrosCalidad.includes("calidad15") && (
                        <tr className={'fondo-impar'}>
                            <td>Calidad 1.5</td>
                            <td>{totalLotes.totalCalidad15?.toLocaleString('es-CO') || 0}</td>
                            <td>{totalLotes.totalCalidad15 > 0 ? ((totalLotes.totalCalidad15 / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                        </tr>
                    )}
                    {filtrosCalidad.includes("calidad2") && (
                        <tr className={'fondo-impar'}>
                            <td>Calidad 2</td>
                            <td>{totalLotes.totalCalidad2?.toLocaleString('es-CO') || 0}</td>
                            <td>{totalLotes.totalCalidad2 > 0 ? ((totalLotes.totalCalidad2 / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                        </tr>
                    )}

                    <tr className={'fondo-par'}>
                        <td>Descartes</td>
                        <td>{totalLotes.totalKilosDescarte.toLocaleString('es-CO')}</td>
                        <td>{totalLotes.totalKilosDescarte > 0 ? ((totalLotes.totalKilosDescarte / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                    </tr>
                    <tr className={'fondo-impar'}>
                        <td>Deshidratacion</td>
                        <td>{(totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalCalidad1 + totalLotes.totalCalidad15 + totalLotes.totalCalidad2)).toLocaleString('es-CO')}</td>
                        <td>{(totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalCalidad1 + totalLotes.totalCalidad15 + totalLotes.totalCalidad2)) > 0 ? (((totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalCalidad1 + totalLotes.totalCalidad15 + totalLotes.totalCalidad2)) / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
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