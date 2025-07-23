/* eslint-disable prettier/prettier */
import { filtroExportacionesSelectType, filtrosExportacionesType } from "../validations/types";

type propsType = {
    setSelectFiltroExportacion: (filtros: filtroExportacionesSelectType) => void;
    selectFiltroExportacion: filtroExportacionesSelectType;
    filtrosCalidad: string[];
    setFiltrosCalidad: (filtros: string[]) => void;

}
export default function FiltroRendimientoPredios({ filtrosCalidad, setFiltrosCalidad, selectFiltroExportacion, setSelectFiltroExportacion }: propsType): JSX.Element {
    const calidades = {
        calidad1: "Calidad 1",
        calidad15: "Calidad 1.5",
        calidad2: "Calidad 2",
    } 
    return (
        <div className="select-indicador-container">
            <div className="filtros-exportaciones-contenido">
                <div>

                    <label htmlFor="calidad" className="filtros-exportaciones-label">
                        <input
                            type="checkbox"
                            id="calidad"
                            className="filtros-exportaciones-checkbox"
                            checked={selectFiltroExportacion.calidad}
                            onChange={(e): void => {
                                if (e.target.checked) {
                                    setSelectFiltroExportacion({ ...selectFiltroExportacion, calidad: true });
                                } else {
                                    setSelectFiltroExportacion({ ...selectFiltroExportacion, calidad: false, calibre: false });
                                    setFiltrosCalidad([]);

                                }
                            }} />
                        <span className="filtros-exportaciones-texto">
                            Calidad
                        </span>
                    </label>

                    {selectFiltroExportacion.calidad && (
                        <div className="filtros-exportaciones-submenu">
                            {Object.entries(calidades).map(([key,value]) => (
                                <label key={key} className="filtros-exportaciones-item">
                                    <input type="checkbox"
                                        onChange={(): void => {
                                            if (filtrosCalidad.includes(key)) {
                                                setFiltrosCalidad(filtrosCalidad.filter(item => item !== key));
                                            } else {
                                                setFiltrosCalidad([...filtrosCalidad, key]);
                                            }
                                        }}
                                    />
                                    <span>{value}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}