/* eslint-disable prettier/prettier */
import { lotesType } from '@renderer/types/lotesType'
import "../css/inventario-fruta-sin-procesar.css"
import { useEffect, useState } from 'react'
type propsType = {
  data: lotesType[]
  loteSeleccionado: lotesType | undefined
  closeVaciado: () => void
  closeDirecto: () => void
  closeDesverdizado: () => void
}

export default function BotonesAccionFrutaSinProcesar(props: propsType): JSX.Element {

  const [enInventario, setEnInventario] = useState<{ [key: string]: number }>({});
  const [totalInventario, setTotalInventario] = useState<number>(0);

  useEffect(() => {
    const result = {};
    let total = 0;
    props.data && props.data.forEach((lote) => {
      if(result[lote.tipoFruta.tipoFruta]) {
        result[lote.tipoFruta.tipoFruta] += lote.inventario ? lote.inventario * lote.promedio : 0;
      } else {
        result[lote.tipoFruta.tipoFruta] = lote.inventario ? lote.inventario * lote.promedio : 0;
      }
      total += lote.inventario ? lote.inventario * lote.promedio : 0;
    })
    setEnInventario(result);
    setTotalInventario(total);

  }, [props.data])
  return (
    <div >
      <div className='inventario-fruta-sin-procesar-botones-container'>

        <button onClick={props.closeDirecto} className='directo-nacional'>
          <span>Directo Nacional</span>
        </button>
        <button onClick={props.closeDesverdizado}
          className={props.loteSeleccionado?.tipoFruta.tipoFruta === "Naranja" ? 'desverdizar' : 'no-desverdizar'} >
          <span >Desverdizar</span>
        </button>
      </div>

      <div className='inventario-fruta-sin-procesar-botones-container'>
        <h3>{
          props.loteSeleccionado && props.loteSeleccionado.enf ?
            props.loteSeleccionado.enf + " " + props.loteSeleccionado.predio.PREDIO
            : "EF1"
        }</h3>
        <h3>
        </h3>
        <h3>
        </h3>
        <h3>
        </h3>

      </div>

      <div className='inventario-fruta-sin-procesar-botones-container'>
        <h3>{
          "En inventario"
        }</h3>
        <h3>Total:{totalInventario.toLocaleString('es-ES')}</h3>

            {Object.entries(enInventario).map(([tipo, cantidad]) => (
              <h3 key={tipo}>Kilos {tipo}: {cantidad.toLocaleString('es-ES')}</h3>
            ))}


      </div>
    </div>
  )
}
