/* eslint-disable prettier/prettier */

import { tipoCalidad } from "@renderer/utils/tipoFrutas";
import { dataLotesType, filtroExportacionesSelectType, totalesLotesType } from "../validations/types";
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";


type propsType = {
    dataCalibres: dataLotesType[];
    dataCalidades: dataLotesType[];
    totalLotes: totalesLotesType;
    filtrosCalidad: string[];
    filtrosCalibre: string[];
    selectFiltroExportacion: filtroExportacionesSelectType

}

export default function TablasRendimientoPredios({
    totalLotes, filtrosCalidad, filtrosCalibre, selectFiltroExportacion, dataCalidades, dataCalibres
}: propsType): JSX.Element {
    const header = ["Totales", "Kilos", "Porcentaje"]
    const tiposCalidades = useTipoFrutaStore(state => state.tiposCalidades)
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
                    {(dataCalidades || []).map(item => {
                        if (filtrosCalidad.includes(item._id)) {
                            return (
                                <tr className={'fondo-impar'} key={item._id + "tablaPredioIndicador"}>
                                    <td>{tipoCalidad(item._id, tiposCalidades)}</td>
                                    <td>{item.totalKilos.toLocaleString('es-CO')}</td>
                                    <td>{item.totalKilos > 0 ? ((item.totalKilos / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
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
                    {(dataCalibres || []).map(item => {
                        if (filtrosCalibre.includes(item._id)) {
                            return (
                                <tr className={'fondo-impar'} key={item._id + "tablaPredioIndicador"}>
                                    <td>{item._id}</td>
                                    <td>{item.totalKilos.toLocaleString('es-CO')}</td>
                                    <td>{item.totalKilos > 0 ? ((item.totalKilos / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
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