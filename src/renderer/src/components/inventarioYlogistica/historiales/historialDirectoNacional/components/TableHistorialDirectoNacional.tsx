/* eslint-disable prettier/prettier */
import { lotesType } from '@renderer/types/lotesType'
import { formatearFecha } from '@renderer/functions/fechas';
import { PiNotePencilDuotone } from "react-icons/pi";

type propsType = {
  data: lotesType[]
  setOpen: (open: boolean) => void
  setItemSeleccionado: (item: lotesType) => void
}

export default function TableHistorialDirectoNacional({ data, setOpen, setItemSeleccionado }: propsType): JSX.Element {
  const headers = ["EF1", "Nombre del predio", "Canastillas", "Kilos", "Tipo de fruta", "Fecha", "User", ""]

  return (
    <div className="table-container">

      <table className='table-main'>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(data || []).map((item, index) => (
            <tr key={item._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
              <td>{item.enf}</td>
              <td>{item.predio && item.predio.PREDIO}</td>
              <td>
                {(item.directoNacional && item.promedio) ?
                  (item.directoNacional / item.promedio).toFixed(2) : 0}
              </td>
              <td>{item.directoNacional && item.directoNacional.toFixed(2)}</td>
              <td>{item.tipoFruta && item.tipoFruta.tipoFruta}</td>
              <td>{formatearFecha(item.infoSalidaDirectoNacional?.fecha || '', true)}</td>
              <td>{item?.infoSalidaDirectoNacional?.user || ''}</td>
              <td>
                <div
                  onClick={(): void => {
                    setItemSeleccionado(item);
                    setOpen(true);
                  }}
                  style={{ color: 'blue' }}>
                  < PiNotePencilDuotone />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
