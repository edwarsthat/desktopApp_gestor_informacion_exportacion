/* eslint-disable prettier/prettier */

import Filtros from "@renderer/components/UI/components/Filtros";
import { useFiltroValue } from "@renderer/hooks/useFiltro"
import { useEffect, useState } from "react";
import EficienciaOperativaComponent from "./components/EficienciaOperativaComponent";
import useAppContext from "@renderer/hooks/useAppContext";
import { validateFrutapRocesadaHora } from "./validations/requestValidations";
import { z } from "zod";
import { agruparRegistrosKilospRocesados } from "./function";
import { IndicadorKilosProcesados } from "./validations/types";
import './styles.css';
import { indicadoresType } from "@renderer/types/indicadoresType";
import EficienciaKilosHora from "./components/EficienciaKilosHora";



export default function ShowIndicadores(): JSX.Element {
    const { setLoading, messageModal } = useAppContext();
    const { setCurrentFilters, currentFilters } = useFiltroValue();
    const [data, setData] = useState<IndicadorKilosProcesados[]>([]);
    const [dataOriginal, setDataOriginal] = useState<indicadoresType[]>([]);
    const [tipoIndicador, setTipoIndicador] = useState<string>('');


    const buscar = async (): Promise<void> => {
        try {
            setLoading(true);
            validateFrutapRocesadaHora.parse(currentFilters);

            const request = {
                action: "get_indicadores_operaciones_kilosProcesados",
                filtro: currentFilters
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }

            const dataFiltrada = agruparRegistrosKilospRocesados(response.data, currentFilters.divisionTiempo);
            setData(dataFiltrada);
            setDataOriginal(response.data);
        } catch (err) {
            // Manejar errores de validación de Zod
            if (err instanceof z.ZodError) {
                const errorMessages = err.errors.map(error => {
                    const field = error.path.length > 0 ? error.path.join('.') : 'campo';
                    return `${field}: ${error.message}`;
                }).join('\n');

                messageModal("error", `Errores de validación:\n${errorMessages}`);
            } else if (err instanceof Error) {
                messageModal("error", `Error al buscar los registros: ${err.message}`);
            } else {
                messageModal("error", "Error desconocido al buscar los registros");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const dataFiltrada = agruparRegistrosKilospRocesados(dataOriginal, currentFilters.divisionTiempo);
        setData(dataFiltrada);
    }, [currentFilters]);

    return (
        <div >
            <div >
                <div className="navBar"></div>
                { tipoIndicador === '' && <h2>Indicadores Operativos</h2>}
                { tipoIndicador === 'kilo-hora' && <h2>Kilogramos por Hora vs Meta</h2>}
                { tipoIndicador === 'eficiencia-kilos-hora' && <h2>Eficiencia Kilogramos por Hora</h2>}

                <hr />

                {/* Select adicional */}
                <div className="select-indicador-container">
                    <label htmlFor="select-indicador">Tipo de Indicador:</label>
                    <select id="select-indicador" className="select-indicador" onChange={(e) :void => setTipoIndicador(e.target.value)} value={tipoIndicador}>
                        <option value="">Seleccionar Tipo de Indicador</option>
                        <option value="kilo-hora">Kilogramos por Hora vs Meta</option>
                        <option value="eficiencia-kilos-hora">Eficiencia Operativa</option>

                    </select>
                </div>

                <Filtros
                    showDivisionTiempo={true}
                    showFechaInicio={true}
                    showFechaFin={true}
                    showButton={true}
                    findFunction={buscar}
                    ggnId="indicadoresGGN"
                    onFiltersChange={setCurrentFilters}
                    />
            </div>

            <div className="show-indicadores-content">
                {tipoIndicador === 'kilo-hora' &&<EficienciaOperativaComponent  currentFilters={currentFilters} data={data} /> }
                {tipoIndicador === 'eficiencia-kilos-hora' &&<EficienciaKilosHora  currentFilters={currentFilters} data={data} /> }
            </div>
        </div>
    )
}
