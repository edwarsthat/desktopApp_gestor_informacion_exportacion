/* eslint-disable prettier/prettier */
import { filtroExportacionesSelectType, filtrosExportacionesType } from "../validations/types";

type propsType = {
    setSelectFiltroExportacion: (filtros: filtroExportacionesSelectType) => void;
    selectFiltroExportacion: filtroExportacionesSelectType;
    filtrosExportacion: filtrosExportacionesType
    filtrosCalidad: string[];
    setFiltrosCalidad: (filtros: string[]) => void;
    filtrosCalibre: string[];
    setFiltrosCalibre: (filtros: string[]) => void;

}
export default function FiltroRendimientoPredios({
    selectFiltroExportacion, setSelectFiltroExportacion, filtrosExportacion,
    setFiltrosCalidad, filtrosCalidad,
    setFiltrosCalibre, filtrosCalibre,
}: propsType): JSX.Element {
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
                                    setSelectFiltroExportacion({ ...selectFiltroExportacion, calidad: true, calibre: false });
                                    setFiltrosCalibre([]);

                                } else {
                                    setSelectFiltroExportacion({ ...selectFiltroExportacion, calidad: false });
                                    setFiltrosCalidad([]);

                                }
                            }} />
                        <span className="filtros-exportaciones-texto">
                            Calidad
                        </span>
                    </label>

                    {selectFiltroExportacion.calidad && (
                        <div className="filtros-exportaciones-submenu">
                            {Object.entries(calidades).map(([key, value]) => (
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

                <label htmlFor="calibre" className="filtros-exportaciones-label">
                    <input
                        type="checkbox"
                        id="calibre"
                        className="filtros-exportaciones-checkbox"
                        checked={selectFiltroExportacion.calibre}
                        onChange={(e): void => {
                            if (e.target.checked) {
                                setSelectFiltroExportacion({ ...selectFiltroExportacion, calibre: true, calidad: false });
                                setFiltrosCalidad([]);

                            } else {
                                setSelectFiltroExportacion({ ...selectFiltroExportacion, calibre: false });
                                setFiltrosCalibre([]);
                            }
                        }} />

                    <span className="filtros-exportaciones-texto">
                        Calibre
                    </span>
                </label>
                {selectFiltroExportacion.calibre && (
                    <div className="filtros-exportaciones-submenu">
                        {filtrosExportacion.calibre.map((calibre, index) => (
                            <label key={calibre + index} className="filtros-exportaciones-item">
                                <input type="checkbox"
                                    onChange={(): void => {
                                        if (filtrosCalibre.includes(calibre)) {
                                            setFiltrosCalibre(filtrosCalibre.filter(item => item !== calibre));
                                        } else {
                                            setFiltrosCalibre([...filtrosCalibre, calibre]);
                                        }
                                    }}
                                />
                                <span>{calibre}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}