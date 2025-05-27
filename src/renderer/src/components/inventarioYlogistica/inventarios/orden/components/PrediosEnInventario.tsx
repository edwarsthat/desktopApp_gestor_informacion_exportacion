/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import "../css/prediosEnInventario.css"
import PredioCard from "../utils/PredioCard"
import { filtroPrediosInventarioType } from "../hooks/useDataOrdenVaceo"

type propsType = {
    filtroPrediosInventario: filtroPrediosInventarioType
    setFiltroPrediosInventario: (e: filtroPrediosInventarioType) => void
    lotes: lotesType[]
    handleAddOrdenVaceo: (_id) => void
}

export default function PrediosEnInventario(props: propsType): JSX.Element {

const handleFiltro = (e): void => {
    props.setFiltroPrediosInventario({
        ...props.filtroPrediosInventario,
        filtro: e.target.value,
    });
}

return (
    <div className="predios-en-inventario-container">
        <h3>Lista de Predios</h3>
        <div className="filtros-predios-inventario-container">
            <input type="text" className="defaultSelect" onChange={handleFiltro} />
            <select className="defaultSelect" onChange={(e): void => props.setFiltroPrediosInventario({...props.filtroPrediosInventario, select: e.target.value })}>
                <option value="">Tipo de fruta</option>
                <option value="Naranja">Naranja</option>
                <option value="Limon">Limon</option>
            </select>
            <hr />
        </div>
        <div>
            {props.lotes.map(lote => (
                <div key={lote._id} className="predios-en-inventario-card-div">
                    <PredioCard lote={lote} handleAddOrdenVaceo={props.handleAddOrdenVaceo} />
                </div>
            ))}
        </div>
    </div>
)
}
