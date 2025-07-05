/* eslint-disable prettier/prettier */

import { filtroExportacionesSelectType, filtrosExportacionesType } from "../validations/types";

type propsType = {
    setSelectFiltroExportacion: (filtros: filtroExportacionesSelectType) => void;
    selectFiltroExportacion: filtroExportacionesSelectType;
    filtrosExportacion: filtrosExportacionesType
    filtrosTipoFruta: string[];
    setFiltrosTipoFruta: (filtros: string[]) => void;
    filtrosCalidad: string[];
    setFiltrosCalidad: (filtros: string[]) => void;
    filtrosCalibre: string[];
    setFiltrosCalibre: (filtros: string[]) => void;
}

export default function FiltrosExportaciones({
    selectFiltroExportacion, setSelectFiltroExportacion, filtrosExportacion,
    setFiltrosTipoFruta, filtrosTipoFruta,
    setFiltrosCalidad, filtrosCalidad,
    setFiltrosCalibre, filtrosCalibre,
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
                            onChange={(e): void => {
                                if(e.target.checked) {
                                    setSelectFiltroExportacion({ ...selectFiltroExportacion, tipoFruta: true });
                                } else {
                                    setSelectFiltroExportacion({ ...selectFiltroExportacion, tipoFruta: false, calidad: false, calibre: false });
                                    setFiltrosTipoFruta([]);
                                    setFiltrosCalidad([]);
                                    setFiltrosCalibre([]);
                                }
                            }} />

                        <span className="filtros-exportaciones-texto">
                            Tipo de Fruta
                        </span>
                    </label>

                    {selectFiltroExportacion.tipoFruta && (
                        <div className="filtros-exportaciones-submenu">
                            {filtrosExportacion.tipoFruta.map((fruta) => (
                                <label key={fruta} className="filtros-exportaciones-item">
                                    <input type="checkbox" onChange={(): void => {
                                        if (filtrosTipoFruta.includes(fruta)) {
                                            setFiltrosTipoFruta(filtrosTipoFruta.filter(item => item !== fruta));
                                        } else {
                                            setFiltrosTipoFruta([...filtrosTipoFruta, fruta]);
                                        }
                                    }} />
                                    <span>{fruta}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    {selectFiltroExportacion.tipoFruta && (
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
                                        setFiltrosCalibre([]);
                                    }
                                }} />
                            <span className="filtros-exportaciones-texto">
                                Calidad
                            </span>
                        </label>)}

                    {selectFiltroExportacion.calidad && (
                        <div className="filtros-exportaciones-submenu">
                            {filtrosExportacion.calidad.map((calidad) => (
                                <label key={calidad} className="filtros-exportaciones-item">
                                    <input type="checkbox"
                                        onChange={(): void => {
                                            if (filtrosCalidad.includes(calidad)) {
                                                setFiltrosCalidad(filtrosCalidad.filter(item => item !== calidad));
                                            } else {
                                                setFiltrosCalidad([...filtrosCalidad, calidad]);
                                            }
                                        }}
                                    />
                                    <span>{calidad}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    {selectFiltroExportacion.calidad && (

                    <label htmlFor="calibre" className="filtros-exportaciones-label">
                        <input
                            type="checkbox"
                            id="calibre"
                            className="filtros-exportaciones-checkbox"
                            checked={selectFiltroExportacion.calibre}
                            onChange={(e): void => {
                                if (e.target.checked) {
                                    setSelectFiltroExportacion({ ...selectFiltroExportacion, calibre: true });
                                } else {
                                    setSelectFiltroExportacion({ ...selectFiltroExportacion, calibre: false });
                                    setFiltrosCalibre([]);
                                }
                            }} />

                        <span className="filtros-exportaciones-texto">
                            Calibre
                        </span>
                    </label>
                    )}

                    {selectFiltroExportacion.calibre && (
                        <div className="filtros-exportaciones-submenu">
                            {filtrosExportacion.calibre.map((calibre) => (
                                <label key={calibre} className="filtros-exportaciones-item">
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
        </div>
    )
}