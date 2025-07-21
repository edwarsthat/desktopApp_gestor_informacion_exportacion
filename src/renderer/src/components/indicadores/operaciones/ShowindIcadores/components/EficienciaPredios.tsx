/* eslint-disable prettier/prettier */

import { lotesType } from "@renderer/types/lotesType";
import { totalesLotesType } from "../validations/types";
import GraficoTortaEficienciaPredios from "../graficos/GraficoTortaEficienciaPredios";
import "./styles/eficienciaPredios.css"
import GraficoBarrasLotesDatos from "../graficos/GraficoBarrasLotesDatos";
type propsType = {
    data: lotesType[];
    totalLotes: totalesLotesType;
}

export default function EficienciaPredios({ data, totalLotes }: propsType): JSX.Element {
    const header = ["Totales", "Kilos", "Porcentaje"]
    return (
        <div className="indicadores-operaciones-eficiencia-predios-container">
            <div>
                <h3 className="card-title">Resumen de Eficiencia</h3>
                <div className="table-container">
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
                            <tr>
                                <td>Kilos Ingresados</td>
                                <td>{totalLotes.totalKilosIngreso.toLocaleString('es-CO')}</td>
                                <td>100%</td>
                            </tr>
                            <tr>
                                <td>Procesados</td>
                                <td>{totalLotes.totalKilosProcesados.toLocaleString('es-CO')}</td>
                                <td>{totalLotes.totalKilosProcesados > 0 ? ((totalLotes.totalKilosProcesados / totalLotes.totalKilosIngreso) * 100).toFixed(2) + '%' : '0%'}</td>
                            </tr>
                            <tr>
                                <td>Exportacion</td>
                                <td>{totalLotes.totalKilosExportacion.toLocaleString('es-CO')}</td>
                                <td>{totalLotes.totalKilosExportacion > 0 ? ((totalLotes.totalKilosExportacion / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                            </tr>
                            <tr>
                                <td>Descartes</td>
                                <td>{totalLotes.totalKilosDescarte.toLocaleString('es-CO')}</td>
                                <td>{totalLotes.totalKilosDescarte > 0 ? ((totalLotes.totalKilosDescarte / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                            </tr>
                            <tr>
                                <td>Deshidratacion</td>
                                <td>{(totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalKilosExportacion)).toLocaleString('es-CO')}</td>
                                <td>{(totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalKilosExportacion)) > 0 ? (((totalLotes.totalKilosProcesados - (totalLotes.totalKilosDescarte + totalLotes.totalKilosExportacion)) / totalLotes.totalKilosProcesados) * 100).toFixed(2) + '%' : '0%'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <GraficoTortaEficienciaPredios
                    totalLotes={totalLotes}
                />
            </div>
            <div>
                <GraficoBarrasLotesDatos
                    data={data}
                    titulo="Kilos Ingresados"
                    elemento="kilos" />
            </div>
            <div>
                <GraficoBarrasLotesDatos
                    data={data}
                    titulo="Kilos Procesados"
                    elemento="kilosVaciados" />
            </div>
            <div>
                <GraficoBarrasLotesDatos
                    data={data}
                    titulo="Kilos Exportacion"
                    elemento="kilosExportacion" />
            </div>
            <div>
                <GraficoBarrasLotesDatos
                    data={data}
                    titulo="Kilos Descarte"
                    elemento="kilosDescarte" />
            </div>
        </div>
    )
}