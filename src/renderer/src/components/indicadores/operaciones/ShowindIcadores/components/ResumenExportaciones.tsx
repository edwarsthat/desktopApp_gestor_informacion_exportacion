/* eslint-disable prettier/prettier */

import { itemExportacionType } from "../validations/types"
import { obtener_arbol_exportacion, sumar_arbol_calidad_tipoFruta, sumar_arbol_tipoFruta,  total_exportacion, total_procesado } from "../function"
import './styles/ResumenExportaciones.css'
import { useEffect, useState } from "react"
import { KilosExportacionSchema } from "@renderer/types/indicadoresType"
import { FaWeightHanging } from "react-icons/fa6";

type propsType = {
    data: itemExportacionType[]
    filtrosTipoFruta: string[];
    filtrosCalidad: string[];
    filtrosCalibre: string[];
}

export default function ResumenExportaciones({
    data, filtrosTipoFruta, filtrosCalidad, filtrosCalibre
}: propsType): JSX.Element {
    const [exportacionOriginal, setExportacionOriginal] = useState<number>(0);
    const [totalProcesado, setTotalProcesado] = useState<number>(0);
    const [porcentajeExportacion, setPorcentajeExportacion] = useState<number>(0);
    const [arbolExportacion, setArbolExportacion] = useState<KilosExportacionSchema>({});


    useEffect(() => {
        const total_exportacion_original = data.reduce((sum, item) => sum + (total_exportacion(item) || 0), 0);
        const total_exportacion_kilos = data.reduce((sum, item) => sum + (total_exportacion(item) || 0), 0);
        const total_procesado_kilos = data.reduce((sum, item) => sum + (total_procesado(item, filtrosTipoFruta) || 0), 0);

        // Calcular el porcentaje de exportación
        const porcentage = total_procesado_kilos > 0
            ? ((total_exportacion_kilos / total_procesado_kilos) * 100)
            : 0;

        const objExportacionTotal = obtener_arbol_exportacion(data)

        setArbolExportacion(objExportacionTotal);
        setExportacionOriginal(total_exportacion_original);
        setTotalProcesado(total_procesado_kilos);
        setPorcentajeExportacion(porcentage)

    }, [data, filtrosTipoFruta, filtrosCalidad, filtrosCalibre]);

    // Formatear números con separador de miles
    const formatNumero = (num: number): string => {
        return new Intl.NumberFormat("es-CO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    };



    return (
        <div className="resumen-exportaciones-container">
            <h3>Resumen Total</h3>
            <div className="resumen-cards">
                <div className="resumen-card procesados">
                    <div className="card-icon">📦</div>
                    <div className="card-content">
                        <h4>Kilos Procesados</h4>
                        <p className="number">{formatNumero(totalProcesado)} kg</p>
                    </div>
                </div>

                <div className="resumen-card exportados">
                    <div className="card-icon">🚢</div>
                    <div className="card-content">
                        <h4>Kilos Exportados</h4>
                        <p className="number">{formatNumero(exportacionOriginal)} kg</p>
                    </div>
                </div>

                <div className="resumen-card eficiencia">
                    <div className="card-icon">📊</div>
                    <div className="card-content">
                        <h4>Eficiencia de Exportación</h4>
                        <p className="percentage">{porcentajeExportacion.toFixed(1)}%</p>
                    </div>
                </div>
            </div>

            {/* Estructura de árbol compacta tipo JSON */}
            <div className="tree-structure-json">
                <div className="json-container">
                {arbolExportacion && (Object.keys(arbolExportacion)).map((tipoFruta, tipoIndex) => (
                    filtrosTipoFruta.includes(tipoFruta) && (
                        <div key={`tipo-${tipoIndex}`} className="json-fruta-group">
                            <div className="json-level json-level-1">
                            <div className="json-line">
                                <span className="json-icon">🍎</span>
                                <span className="json-key">{tipoFruta}:</span>
                                <span className="json-value">{formatNumero(sumar_arbol_tipoFruta(arbolExportacion, tipoFruta))} kg</span>
                            </div>

                            {arbolExportacion[tipoFruta] && (Object.keys(arbolExportacion[tipoFruta])).map((calidad, calidadIndex) => (
                                filtrosCalidad.includes(calidad) && (
                                    <div key={`calidad-${calidadIndex}`} className="json-level json-level-2">
                                        <div className="json-line">
                                            <span className="json-icon">⭐</span>
                                            <span className="json-key">{calidad}:</span>
                                            <span className="json-value">{formatNumero(sumar_arbol_calidad_tipoFruta(arbolExportacion, tipoFruta, calidad))} kg</span>
                                        </div>

                                        {arbolExportacion[tipoFruta][calidad] && (Object.keys(arbolExportacion[tipoFruta][calidad])).map((calibre, calibreIndex) => (
                                            filtrosCalibre.includes(calibre) && (
                                                <div key={`calibre-${calibreIndex}`} className="json-level json-level-3">
                                                    <div className="json-line">
                                                        <span className="json-icon"><FaWeightHanging /></span>
                                                        <span className="json-key">{calibre}:</span>
                                                        <span className="json-value">{formatNumero(arbolExportacion[tipoFruta][calidad][calibre])} kg</span>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                    )
                ))}
                </div>
            </div>
        </div>
    )
}



