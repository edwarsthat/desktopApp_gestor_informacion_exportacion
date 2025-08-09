/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import NavCalidadInternaForm from './utils/NavCalidadInternaForm'
import { lotesType } from '@renderer/types/lotesType';
import useAppContext from '@renderer/hooks/useAppContext';
import ContenidoZumo from './components/ContenidoZumo';
import CalidadDeLaFruta from './components/CalidadDeLaFruta';
import PruebasPlataforma from './components/PruebasPlataforma';
import useForm from '@renderer/hooks/useForm';
import { formInit, formSchema, formType } from './validations/validation';
import './css/calidad-interna.css'



export default function CalidadInterna(): JSX.Element {
  const { messageModal, eventoServidor, triggerServer, setLoading, loading } = useAppContext();
  const { formState, handleChange, setFormState, resetForm, validateForm, formErrors } = useForm<formType>(formInit)
  const [lotesData, setLotesData] = useState([])
  const [lote, setLote] = useState<lotesType>()

  const obtenerData = async (): Promise<void> => {
    try {
      setLoading(true)
      const request = {
        action: 'get_calidad_ingresos_calidadInterna'
      }
      const lotes = await window.api.server2(request)
      if (lotes.status !== 200) throw new Error(`Code ${lotes.status}: ${lotes.message}`)
      setLotesData(lotes.data)
    } catch (e: unknown) {
      if (e instanceof Error) {
        messageModal("error", `Error: ${e.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    obtenerData()
  }, [])

  useEffect(() => {
    if (
      eventoServidor === 'add_lote' ||
      eventoServidor === 'calidad_interna'
    ) {
      obtenerData()
    }
  }, [triggerServer])

  const guardar = async (): Promise<void> => {
    try {
      if (!lote) throw new Error("Lote no encontrado")
      const isValid = validateForm(formSchema)
      if (!isValid) return console.log(formErrors)

      const requestLotes = {
        action: 'put_calidad_ingresos_calidadInterna',
        data: formState,
        _id: lote?._id
      }
      const response = await window.api.server2(requestLotes)
      if (response.status !== 200) {
        throw new Error(`${response.message}`)
      }
      messageModal("success", "Datos guardados con exito");
      resetForm();
    } catch (e: unknown) {
      if (e instanceof Error) {
        messageModal("error", `Error: ${e.message}`);
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div >
      <div className='navBar'></div>
      <h2>Ingreso calidad interna</h2>
      <hr />
      <NavCalidadInternaForm lotesData={lotesData} setLote={setLote} />
      <div>
        <div className="calidad-interna-container">
          <div className="calidad-interna-div1">
            <ContenidoZumo
              formErrors={formErrors}
              setFormState={setFormState}
              handleChange={handleChange}
              formState={formState}
            />
            <CalidadDeLaFruta lote={lote} handleChange={handleChange} formErrors={formErrors} />
          </div>

          <PruebasPlataforma
            formErrors={formErrors}
            handleChange={handleChange}
            formState={formState}
          />

          <div className="calidad-interna-actions">
            <button
              disabled={loading}
              onClick={guardar}
              className="bg-orange-600 text-white border-none px-4 py-2 rounded-md active:bg-orange-900"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
