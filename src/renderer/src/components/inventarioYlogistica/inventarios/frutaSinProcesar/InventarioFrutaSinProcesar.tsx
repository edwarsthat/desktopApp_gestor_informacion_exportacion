/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import useAppContext from '@renderer/hooks/useAppContext'
import { lotesType } from '@renderer/types/lotesType'
import TableFrutaSinProcesar from './components/TableFrutaSinProcesar'
import BotonesAccionFrutaSinProcesar from './components/BotonesAccionFrutaSinProcesar'
import { createPortal } from 'react-dom'
import Directo from './modals/Directo'
import Desverdizado from './modals/Desverdizado'
import useDataInventarioFrutaSinProcesar from './hooks/useDataInventarioFrutaSinProcesar'
import Filtros from '@renderer/components/UI/components/Filtros'
import { useFiltroValue } from '@renderer/hooks/useFiltro'

export default function InventarioFrutaSinProcesar(): JSX.Element {
  const { eventoServidor, triggerServer } = useAppContext()
  const {setCurrentFilters, currentFilters} = useFiltroValue();
  const { obtenerFruta, data, datosOriginales, setData } = useDataInventarioFrutaSinProcesar()


  const [loteSeleccionado, setLoteSeleccionado] = useState<lotesType>()

  //states de los modales
  const [showVaciarModal, setShowVaciarModal] = useState<boolean>(false)
  const [showDirectoModal, setShowDirectoModal] = useState<boolean>(false)
  const [showDesverdizadoModal, setShowDesverdizadoModal] = useState(false)

  //filtro
  useEffect(() => {
    if (!datosOriginales) return
    let datosFiltrados = datosOriginales

    // Filtro por fecha
    if (currentFilters.fechaInicio || currentFilters.fechaFin) {
      let fechaFiltroInicio
      let fechaFiltroFin

      if (currentFilters.fechaInicio) {
        const fechaInicioUTC = new Date(currentFilters.fechaInicio)
        fechaInicioUTC.setHours(fechaInicioUTC.getHours() + 5)
        fechaFiltroInicio = fechaInicioUTC.getTime() // Convertir a tiempo en milisegundos para comparación
      } else {
        fechaFiltroInicio = 0 // No hay fecha mínima
      }

      if (currentFilters.fechaFin) {
        const fechaFinUTC = new Date(currentFilters.fechaFin)
        fechaFinUTC.setDate(fechaFinUTC.getDate() + 1)
        fechaFinUTC.setHours(fechaFinUTC.getHours() + 5)
        fechaFiltroFin = fechaFinUTC.getTime() // Convertir a tiempo en milisegundos para comparación
      } else {
        fechaFiltroFin = 999999999999999 // No hay fecha máxima
      }

      datosFiltrados = datosFiltrados.filter((lote) => {
        let fechaIngreso
        if (lote.fecha_ingreso_inventario) {
          fechaIngreso = new Date(lote.fecha_ingreso_inventario).getTime()
        } else if (lote.fecha_ingreso_patio) {
          fechaIngreso = new Date(lote.fecha_ingreso_patio).getTime()
        } else if (lote.fecha_estimada_llegada) {
          fechaIngreso = new Date(lote.fecha_estimada_llegada).getTime()
        }
        return fechaIngreso >= fechaFiltroInicio && fechaIngreso <= fechaFiltroFin
      })
    }

    if(currentFilters.tipoFruta){
      datosFiltrados = datosFiltrados.filter(lote => lote.tipoFruta === currentFilters.tipoFruta)
    }

    if(currentFilters.GGN){
      datosFiltrados = datosFiltrados.filter(lote => lote.GGN)
    }

    setData(datosFiltrados)
  }, [currentFilters, datosOriginales])

  const clickLote = (id): void => {
    if (!data) return
    const lote: lotesType | undefined = data.find((item) => item._id === id)
    if (lote !== undefined) {
      setLoteSeleccionado(lote)
    }
  }

  useEffect(() => {
    if (
      eventoServidor === 'add_lote' ||
      eventoServidor === 'vaciar_lote' ||
      eventoServidor === 'directo_nacional' ||
      eventoServidor === 'modificar_historial_fruta_procesada' ||
      eventoServidor === 'inspeccion_fruta' ||
      eventoServidor === 'derogar_lote' ||
      eventoServidor === 'calidad_interna' ||
      eventoServidor === 'enviar_desverdizado'
    ) {
      obtenerFruta()
    }
  }, [triggerServer])
  useEffect(() => {
    obtenerFruta()
  }, [])

  const closeVaciado = (): void => {
    setShowVaciarModal(!showVaciarModal)
  }
  const closeDirecto = (): void => {
    setShowDirectoModal(!showDirectoModal)
  }
  const closeDesverdizado = (): void => {
    setShowDesverdizadoModal(!showDesverdizadoModal)
  }
  const handleInfo = (): void => {
    setLoteSeleccionado(undefined)
  }

  if (!data) {
    return <div>Cargando datos...</div>
  }

  return (
    <div>
      <div className="navBar"></div>
      <h2>Fruta sin procesar</h2>
      <hr />

      <Filtros
        showTipoFruta={true}
        showFechaFin={true}
        showFechaInicio={true}
        showGGN={true}
        ggnId="fruta-sin-procesar"
        onFiltersChange={setCurrentFilters}
      />

      <BotonesAccionFrutaSinProcesar
        data={data}
        loteSeleccionado={loteSeleccionado}
        closeVaciado={closeVaciado}
        closeDirecto={closeDirecto}
        closeDesverdizado={closeDesverdizado}
      />

      <TableFrutaSinProcesar
        loteSeleccionado={loteSeleccionado}
        data={data}
        clickLote={clickLote}
      />

      {showDirectoModal &&
        createPortal(
          <Directo
            obtenerFruta={obtenerFruta}
            handleInfo={handleInfo}
            closeDirecto={closeDirecto}
            loteSeleccionado={loteSeleccionado}
          />,
          document.body
        )}
      {showDesverdizadoModal &&
        createPortal(
          <Desverdizado
            obtenerFruta={obtenerFruta}
            handleInfo={handleInfo}
            closeDesverdizado={closeDesverdizado}
            loteSeleccionado={loteSeleccionado}
          />,
          document.body
        )}
    </div>
  )
}
