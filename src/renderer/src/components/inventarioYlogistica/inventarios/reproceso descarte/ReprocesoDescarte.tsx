/* eslint-disable prettier/prettier */
// import InventarioDescartes from './components/InventarioDescartes'
import { useEffect, useState } from 'react'
import './css/styles.css'
import '@renderer/css/dialog-style.css'
import Filtros from '@renderer/components/UI/components/Filtros'
import useDataInventarioDescartes from './hooks/useDataInventarioDescartes'

import { useFiltroValue } from '@renderer/hooks/useFiltro'
import InventarioData from './components/InventarioData'
import BotonesInventarioDescarte from './components/BotonesInventarioDescarte'
import useForm from '@renderer/hooks/useForm'
import { formType } from './types/types'
import { initialForm } from './validations/validateRequest'
import ModalDespachoFruta from './components/ModalDespachoFruta'
import useAppContext from '@renderer/hooks/useAppContext'
import ModalCrearRegistroFrutaDescompuesta from './components/ModalCrearRegistroFrutaDescompuesta'

export default function ReprocesoDescarte(): JSX.Element {
  const {eventoServidor,triggerServer} = useAppContext();
  const { setCurrentFilters, currentFilters, resetCurrentValue } = useFiltroValue();
  const {
    formState, handleChange, setFormState,
    resetForm, formErrors, validateForm
  } = useForm<formType>(initialForm)
  const { data, obtenerFruta } = useDataInventarioDescartes({ currentFilters })
  const [openDespacho, setOpenDespacho] = useState<boolean>(false)
  const [openDescompuesta, setOpenDescompuesta] = useState<boolean>(false)

  useEffect(() => {
    obtenerFruta()
  }, [])

  useEffect(() => {
    setFormState({
      ...formState,
      tipoFruta: currentFilters.tipoFruta
    })
  }, [currentFilters])

  useEffect(() => {
    if (
      eventoServidor === 'descarte_change' 
    ) {
      obtenerFruta()
    }
  }, [triggerServer])

  return (
    <div className="componentContainer">
      <div className="navBar"></div>
      <h2>Descarte inventario</h2>
      <hr />
      <Filtros
        showTipoFruta={true}
        onFiltersChange={setCurrentFilters}
      />
      <BotonesInventarioDescarte
        resetCurrentValue={resetCurrentValue}
        setOpenDescompuesta={setOpenDescompuesta}
        setOpenDespacho={setOpenDespacho}
        formState={formState}
        validateForm={validateForm}
        resetForm={resetForm}
        data={data} />

      <InventarioData
        formState={formState}
        formErrors={formErrors}
        data={data}
        handleChange={handleChange} />

      <ModalDespachoFruta
        resetCurrentValue={resetCurrentValue}
        resetInventarioForm={resetForm}
        formInventario={formState}
        tipoFruta={currentFilters.tipoFruta}
        fruta={data}
        open={openDespacho}
        onClose={(): void => setOpenDespacho(false)}
      />

      <ModalCrearRegistroFrutaDescompuesta 
        resetCurrentValue={resetCurrentValue}
        formInventario={formState}
        resetInventarioForm={resetForm}
        tipoFruta={currentFilters.tipoFruta}
        fruta={data}
        open={openDescompuesta} 
        onClose={():void => setOpenDescompuesta(false)} 
      />

    </div>
  )
}
