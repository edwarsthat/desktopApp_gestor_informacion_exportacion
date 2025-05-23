/* eslint-disable prettier/prettier */
// import InventarioDescartes from './components/InventarioDescartes'
import { useEffect, useState } from 'react'
import './css/styles.css'
import '@renderer/css/dialog-style.css'
import Filtros from '@renderer/components/UI/components/Filtros'
// import BotonesInventarioDescartes from './utils/BotonesInventarioDescartes'
import TarjetaInvetarioDescartes from './components/TarjetaInvetarioDescartes'
import useDataInventarioDescartes from './hooks/useDataInventarioDescartes'
import { lotesType } from '@renderer/types/lotesType'
import useModificarDescarte from './hooks/useModificarDescarte'
import BotonesInventarioDescartes from './components/BotonesInventarioDescartes'
import ModalCrearRegistroFrutaDescompuesta from './components/ModalCrearRegistroFrutaDescompuesta'
import { createPortal } from 'react-dom'
import ModalConfirmarProcesoDescarte from './components/ModalConfirmarProcesoDescarte'
import ModalModificarInventarioDescarte from './components/ModalModificarInventarioDescarte'
import ConfirmacionModal from '@renderer/messages/ConfirmacionModal'
import ModalInfoDescartes from './components/ModalInfoDescarte'
import useSendRequest from './hooks/useSendRequest'
import {  useFiltroValue } from '@renderer/hooks/useFiltro'

export default function ReprocesoDescarte(): JSX.Element {

  const { setCurrentFilters, currentFilters} = useFiltroValue();
  const [loteSeleccionado, setLoteSeleccionado] = useState<lotesType>()
  const [showModal, setShowModal] = useState<boolean>(false)
  const { data, obtenerFruta } = useDataInventarioDescartes({currentFilters})

  const [modal, setModal] = useState<boolean>(false)
  const [propsModal, setPropsModal] = useState({ action: '', data: {} })
  const [showResumen, setShowResumen] = useState<boolean>(false)
  const [resumen, setResumen] = useState<lotesType[] | undefined>()

  //mostrar modal reproceso
  const [confirm, setConfirm] = useState<boolean>(false)
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const {
    seleccionarVariosItems,
    seleccionarItems,
    enfObj,
    reprocesar,
    handleChange,
    formState,
    setFormState,
    uncheckedAll
  } = useModificarDescarte(data || [])
  const { reprocesarPredio, reprocesarCelifrut } = useSendRequest({ propsModal, data })

  useEffect(() => {
    obtenerFruta()
  }, [])

  const handleModificar = (): void => {
    setShowModal(!showModal)
  }

  useEffect(() => {
    const reprocesarData = async (): Promise<void> => {
      if (message === 'Reprocesar el lote') {
        await reprocesarPredio()
      } else if (message === 'Reprocesar como Celifrut') {
        await reprocesarCelifrut()
      }
      uncheckedAll()
      setMessage('')
      setShowConfirmation(false)
      await obtenerFruta()
    }
    if (confirm) {
      reprocesarData()
    }
    setConfirm(false)
  }, [confirm])

  const procesar = (data: string): void => {
    setMessage(data)
    setShowConfirmation(true)
    setPropsModal({ action: data, data: enfObj })
  }

  const abrirResumen = (resumen: lotesType[]): void => {
    setShowResumen(true)
    setResumen(resumen)
  }

  const cerrarResumen = (): void => {
    setShowResumen(false)
    setResumen(undefined)
  }


  return (
    <div className="componentContainer">
      <div className="navBar"></div>
      <h2>Descarte inventario</h2>
      <hr />
      <Filtros 
        showTipoFruta={true} 
        onFiltersChange={setCurrentFilters}
      />

      <BotonesInventarioDescartes
        setModal={setModal}
        formState={formState}
        handleChange={handleChange}
        table={data}
        enfObj={enfObj}
        reprocesar={reprocesar}
        procesar={procesar}
      />

      {data &&
        data.map((lote) => (
          <div key={lote._id}>
            <TarjetaInvetarioDescartes
              lote={lote}
              setLoteSeleccionado={setLoteSeleccionado}
              handleModificar={handleModificar}
              seleccionarItems={seleccionarItems}
              seleccionarVariosItems={seleccionarVariosItems}
            />
          </div>
        ))}

      <ModalCrearRegistroFrutaDescompuesta
        table={data}
        formState={formState}
        setFormState={setFormState}
        filtro={currentFilters}
      />

      {modal &&
        createPortal(
          <ModalConfirmarProcesoDescarte
            obtenerFruta={obtenerFruta}
            filtro={currentFilters.tipoFruta}
            table={data}
            setModal={setModal}
            formState={formState}
            setFormState={setFormState}
            abrirResumen={abrirResumen}
          />,
          document.body
        )}

      {showModal && (
        <ModalModificarInventarioDescarte
          showModal={showModal}
          loteSeleccionado={loteSeleccionado}
          handleModificar={handleModificar}
        />
      )}
      {showConfirmation && (
        <ConfirmacionModal
          message={message}
          setConfirmation={setConfirm}
          setShowConfirmationModal={setShowConfirmation}
        />
      )}
      {showResumen && <ModalInfoDescartes cerrarResumen={cerrarResumen} data={resumen} />}
      {showConfirmation && (
        <ConfirmacionModal
          message={message}
          setConfirmation={setConfirm}
          setShowConfirmationModal={setShowConfirmation}
        />
      )}
    </div>
  )
}
