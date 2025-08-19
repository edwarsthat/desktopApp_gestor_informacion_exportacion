/* eslint-disable prettier/prettier */
import { useEffect } from 'react'
import * as strings from './json/strings_ES.json'
import { crear_request_guardar } from './functions/functions'
import useAppContext from '@renderer/hooks/useAppContext'
import '@renderer/css/components.css'
import '@renderer/css/form.css'
import useForm from '@renderer/hooks/useForm'
import FormInput from '@renderer/components/UI/components/Forminput'
import { formSchema, formType, initialValues, labelsForms } from './validations/ingresoLotesValidations'
import FormSelect from '@renderer/components/UI/components/FormSelect'
import useGetSysData from '@renderer/hooks/useGetSysData'

export default function IngresoFruta(): JSX.Element {
  const { messageModal, setLoading, loading } = useAppContext()
  const { obtenerTipoFruta2, tiposFruta2, obtenerEf1, ef1, proveedores, obtenerPredios } = useGetSysData({});
  const { formState, handleChange, resetForm, formErrors, validateForm } =
    useForm<formType>(initialValues)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true)
        await obtenerEf1()
        await obtenerPredios()
        await obtenerTipoFruta2()
      } catch (err) {
        if (err instanceof Error) {
          messageModal('error', err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const guardarLote: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      const result = validateForm(formSchema)
      if (!result) return

      setLoading(true)

      const datos = crear_request_guardar(formState)

      const data = { ...datos }
      const request = {
        dataLote: { ...data, GGN: data.GGN === 'true', enf: ef1 },
        dataCanastillas: {
          canastillasPropias:
            Number(formState.canastillasPropias ?? 0) +
            Number(formState.canastillasVaciasPropias ?? 0),
          canastillasPrestadas:
            Number(formState.canastillasPrestadas ?? 0) +
            Number(formState.canastillasVaciasPrestadas ?? 0)
        },
        action: 'post_inventarios_ingreso_lote'
      }
      // const response = await window.api.server2(request)
      // if (response.status !== 200) throw new Error(`Error ${response.status}: ${response.message}`)

      const impresion = await window.api.imprimirEtiqueta(request.dataLote)
      if(!impresion) throw new Error('Error al imprimir etiqueta')

      resetForm()
      await obtenerEf1()
      messageModal('success', '¡lote guardado con exito!')
    } catch (err) {
      if (err instanceof Error) {
        messageModal('error', err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="navBar"></div>
      <div>
        <h2>{strings.title}</h2>
        <hr />
      </div>
      <form className="form-container" onSubmit={guardarLote}>
        <h2>{ef1}</h2>

        {Object.entries(labelsForms).map(([key, value]) => {
          if (key === "nombrePredio") {
            return (
              <FormSelect
                key={key}
                name="nombrePredio"
                value={formState.nombrePredio}
                label={value}
                onChange={handleChange}
                error={formErrors.nombrePredio}
                data={proveedores.map((item) => ({ _id: item._id, name: item.PREDIO }))}
              />
            )
          }
          else if (key === "tipoFruta") {
            return (
              <FormSelect
                key={key}
                name="tipoFruta"
                value={formState.tipoFruta}
                label={value}
                onChange={handleChange}
                error={formErrors.tipoFruta}
                data={tiposFruta2.map((item) => ({ _id: item._id, name: item.tipoFruta }))}
              />
            )
          } else if (key === "GGN") {
            return (
              <FormSelect
                key={key}
                name="GGN"
                value={formState.GGN}
                label={value}
                onChange={handleChange}
                error={formErrors.GGN}
                data={[{ name: "Si", _id: "true" }, { name: "No", _id: "false" }]}
              />
            )
          } else if (key === "fecha_estimada_llegada") {
            return (
              <FormInput
                key={key}
                name={key}
                label={value}
                type="datetime-local"
                value={formState[key]}
                onChange={handleChange}
                error={formErrors[key]}
              />
            )
          }

          else {
            return (
              <FormInput
                key={key}
                name={key}
                label={value}
                type="text"
                value={formState[key]}
                onChange={handleChange}
                error={formErrors[key]}
              />
            )
          }
        })}

        <div>
          <label>{strings.observaciones}</label>
          <textarea
            onChange={handleChange}
            name="observaciones"
            value={formState?.observaciones ? formState.observaciones : ''}
            required
          />
        </div>
        <div className="defaultSelect-button-div">
          <button disabled={loading} type="submit">
            Guardar
          </button>
        </div>
      </form>
    </div>
  )
}
