/* eslint-disable prettier/prettier */

import { filtroExportacionesSelectType, filtrosExportacionesType } from "../validations/types";

type propsType = {
    setSelectFiltroExportacion: (filtros: filtroExportacionesSelectType) => void;
    selectFiltroExportacion: filtroExportacionesSelectType;
    filtrosExportacion: filtrosExportacionesType
}

export default function FiltrosExportaciones({
    setSelectFiltroExportacion, selectFiltroExportacion, filtrosExportacion
}: propsType): JSX.Element {
    return (
        <div className="select-indicador-container">
            <div className="filtros-exportaciones-contenido">
                <div>
                    <label htmlFor="tipoFruta" className="filtros-exportaciones-label">
                        <input
                            type="checkbox"
                            id="tipoFruta"
                            className="filtros-exportaciones-checkbox"
                            checked={selectFiltroExportacion.tipoFruta}
                            onChange={(e): void => setSelectFiltroExportacion({ ...selectFiltroExportacion, tipoFruta: e.target.checked })} />

                        <span className="filtros-exportaciones-texto">
                            Tipo de Fruta
                        </span>
                    </label>

                    {selectFiltroExportacion.tipoFruta && (
                        <div className="filtros-exportaciones-submenu">
                            {filtrosExportacion.tipoFruta.map((fruta) => (
                                <label key={fruta} className="filtros-exportaciones-item">
                                    <input type="checkbox" />
                                    <span>{fruta}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="calidad" className="filtros-exportaciones-label">
                        <input
                            type="checkbox"
                            id="calidad"
                            className="filtros-exportaciones-checkbox"
                            checked={selectFiltroExportacion.calidad}
                            onChange={(e): void => setSelectFiltroExportacion({ ...selectFiltroExportacion, calidad: e.target.checked })} />
                        <span className="filtros-exportaciones-texto">
                            Calidad
                        </span>
                    </label>

                    {selectFiltroExportacion.calidad && (
                        <div className="filtros-exportaciones-submenu">
                            {filtrosExportacion.calidad.map((calidad) => (
                                <label key={calidad} className="filtros-exportaciones-item">
                                    <input type="checkbox" />
                                    <span>{calidad}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="calibre" className="filtros-exportaciones-label">
                        <input
                            type="checkbox"
                            id="calibre"
                            className="filtros-exportaciones-checkbox"
                            checked={selectFiltroExportacion.calibre}
                            onChange={(e): void => setSelectFiltroExportacion({ ...selectFiltroExportacion, calibre: e.target.checked })} />

                        <span className="filtros-exportaciones-texto">
                            Calibre
                        </span>
                    </label>
                    
                    {selectFiltroExportacion.calibre && (
                        <div className="filtros-exportaciones-submenu">
                            {filtrosExportacion.calibre.map((calibre) => (
                                <label key={calibre} className="filtros-exportaciones-item">
                                    <input type="checkbox" />
                                    <span>{calibre}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}