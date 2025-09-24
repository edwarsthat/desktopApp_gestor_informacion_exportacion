/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import "../css/ordenVaciadoCard.css"
import { ImCancelCircle } from "react-icons/im";

type propsType = {
  lote: lotesType
  index: number
  handleRemoveOrdenVaceo: (_id) => void
}

export default function OrdenVaciadoCard(props: propsType): JSX.Element {

  return (
    <div className="orden-vaciado-card-container">
      <div className="orden-vaciado-card-container-div-index">
        {props.index + 1}
      </div>
      <div className="orden-vaciado-card-container-div-predio">
        <div className="orden-vaciado-card-container-div-info">
          <p>{props.lote?.enf}</p>
          <p>{props.lote?.predio?.PREDIO}</p>
          <p>GGN: {props.lote.GGN && props.lote.predio.GGN.code}</p>

          {Object.prototype.hasOwnProperty.call(props.lote, "desverdizado") ?
            <p> Can: {Number(props.lote?.canastillas)}</p> :
            <p>Can: {Number(props.lote?.canastillas)}</p>
          }

          {Object.prototype.hasOwnProperty.call(props.lote, "desverdizado") ?
            <p>{(Number(props.lote?.canastillas) * Number(props.lote.promedio)).toLocaleString('es-CO')} Kg</p> :
            <p>{(Number(props.lote?.canastillas) * Number(props.lote.promedio)).toLocaleString('es-CO')} Kg</p>
          }
          {Object.prototype.hasOwnProperty.call(props.lote, "desverdizado") &&
            <p>Desverdizado</p>
          }
          <p>{props.lote.tipoFruta.tipoFruta}</p>

          {/* <p>{props.lote._id}</p> */}

        </div>

      </div>
      <div className="orden-vaciado-card-container-div-cancel">

        <button onClick={(): void => props.handleRemoveOrdenVaceo(props.lote._id)}>
          <ImCancelCircle />
        </button>

      </div>
    </div>
  )
}
