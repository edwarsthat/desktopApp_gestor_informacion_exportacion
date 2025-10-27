/* eslint-disable prettier/prettier */
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";
import { filtroExportacionesSelectType, filtrosExportacionesType } from "../validations/types";
import { tipoCalidad } from "@renderer/utils/tipoFrutas";

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

    const tiposCalidades = useTipoFrutaStore(state => state.tiposCalidades);
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
                            {filtrosExportacion.calidad.map((calidad, index) => (
                                <label key={calidad + index} className="filtros-exportaciones-item">
                                    <input type="checkbox"
                                        onChange={(): void => {
                                            if (filtrosCalidad.includes(calidad)) {
                                                setFiltrosCalidad(filtrosCalidad.filter(item => item !== calidad));
                                            } else {
                                                setFiltrosCalidad([...filtrosCalidad, calidad]);
                                            }
                                        }}
                                    />
                                    <span>{tipoCalidad(calidad, tiposCalidades)}</span>
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