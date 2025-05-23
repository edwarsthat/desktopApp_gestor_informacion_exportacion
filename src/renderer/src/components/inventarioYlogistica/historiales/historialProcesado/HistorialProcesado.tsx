/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import TableHistorialProcesado from './components/TableHistorialProcesado'
import BotonesAccionHistorialFrutaProcesada from './components/BotonesAccionHistorialFrutaProcesada'
import { format } from 'date-fns'
import ModificarHistorialProceso from './modals/ModificarHistorialProceso'
import useAppContext from '@renderer/hooks/useAppContext'
import { historialLotesType } from '@renderer/types/lotesType'
import useDataHistorialProcesado from './hooks/useDataHistorialProcesado'
import Filtros from '@renderer/components/UI/components/Filtros'
import { useFiltroValue } from '@renderer/hooks/useFiltro'



export default function HistorialProcesado(): JSX.Element {
  const { eventoServidor, triggerServer } = useAppContext();
  const { setCurrentFilters, currentFilters } = useFiltroValue();
  const { data, obtenerHistorialProceso } = useDataHistorialProcesado(currentFilters);

  const [titleTable, setTitleTable] = useState('Historial Lotes Procesados')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [propsModal, setPropsModal] = useState<historialLotesType>()
  const [showModificar, setShowModificar] = useState<boolean>(false)

  const closeModal = (): void => {
    setShowModal(!showModal)
  }

  const clickLote = (e): void => {
    const id = e.target.value
    const lote: historialLotesType | undefined = data.find((item) => item._id === id)
    if (lote !== undefined) {
      setPropsModal(lote)
      if (e.target.checked) {
        setTitleTable((lote?.documento.enf || '') + ' ' + (lote?.documento.predio && lote?.documento.predio.PREDIO || ''))
        if (format(new Date(lote?.fecha), 'MM/dd/yyyy') == format(new Date(), 'MM/dd/yyyy')) {
          setShowModificar(true)
        } else {
          setShowModificar(false)
        }
      }
    }
  }

  useEffect(() => {
    if (
      eventoServidor === 'vaciar_lote' ||
      eventoServidor === 'modificar_historial_fruta_procesada'
    ) {
      obtenerHistorialProceso()
    }
  }, [triggerServer])

  useEffect(() => {
    if (currentFilters.fechaInicio !== '') {
      obtenerHistorialProceso()
    }
  }, [currentFilters.fechaFin,currentFilters.fechaInicio])


  return (
    <div>
      <div className="navBar"></div>

      <Filtros
        showFechaInicio={true}
        showFechaFin={true}
        showTipoFruta={true}
        showGGN={true}
        ggnId="historial-procesado"
        onFiltersChange={setCurrentFilters} />

      <BotonesAccionHistorialFrutaProcesada
        title={titleTable}
        table={data}
        closeModal={closeModal}
        modificar={showModificar}
      />
      <TableHistorialProcesado table={data} clickLote={clickLote} />

      {showModal &&
        createPortal(
          <ModificarHistorialProceso
            obtenerHistorialProceso={obtenerHistorialProceso}
            closeModal={closeModal}
            propsModal={propsModal}
          />,
          document.body
        )}
    </div>
  )
}
