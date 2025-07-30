/* eslint-disable prettier/prettier */
import { historialLotesType } from '@renderer/types/lotesType'
import { formatearFecha } from '@renderer/functions/fechas';

type propsType = {
  table: historialLotesType[]
  clickLote: (e) => void
}
const headers = ["", "EF1", "Nombre del predio", "Canastillas", "Kilos", "GGN", "Tipo de fruta", "Fecha", "User"];

export default function TableHistorialProcesado(props: propsType): JSX.Element {
  return (
    <div className="table-container">

      <table className='table-main'>
        <thead>
          <tr >
            {headers.map(item => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.table && props.table.map((item, index) => (
            <tr key={item._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} >
              <td>
                <input type="radio" id={item._id} value={item._id} onClick={props.clickLote} name='lote'></input>
              </td>
              <td>{item.documento.enf}</td>
              <td>{item.documento.predio && item.documento.predio.PREDIO}</td>
              <td>
                {item.documento.kilosVaciados && item.documento.promedio ?
                  (item.documento.kilosVaciados / item.documento.promedio).toLocaleString('es-ES') : 0}
              </td>
              <td>{item.documento.kilosVaciados && item.documento.kilosVaciados.toLocaleString('es-ES')}</td>
              <td>{item.documento.GGN && (item.documento.predio.GGN.code ?? '')}</td>
              <td>{item.documento.tipoFruta.tipoFruta}</td>
              <td>{formatearFecha(item.fecha, true)}</td>
              <td>{item.user && item.user}</td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )
}
