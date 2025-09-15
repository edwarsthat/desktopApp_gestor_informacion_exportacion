/* eslint-disable prettier/prettier */

import Filtros from "@renderer/components/UI/components/Filtros";
import useFetchDataFilter from "@renderer/hooks/useFetchDataFilter";
import { useFiltroValue } from "@renderer/hooks/useFiltro";
import { AuditLog } from "./types";
import CardRegistro from "./components/CardRegistro";
import './styles/TrazabilidadEF1.css'

export default function TrazabilidadEF1(): JSX.Element {
    const { setCurrentFilters, currentFilters } = useFiltroValue();
    const { data, obtenerData } = useFetchDataFilter<AuditLog>({
        currentFilters,
        actionData: "get_proceso_registros_trazabilidad_ef1"
    })
    const buscar = async (): Promise<void> => {
        await obtenerData()
    }
    return (
        <div>
            <div className="navBar"></div>
            <h2>Trazabilidad EF1</h2>
            <hr />

            <Filtros
                showEF={true}
                findFunction={buscar}
                onFiltersChange={setCurrentFilters}
                showButton={true}
            />

            {data && <div className="total-registros">Total de registros: {data.length}</div>}

            {data && data.map((registro) => (
                <CardRegistro key={registro._id} registro={registro} />
            ))}
        </div>
    )
}