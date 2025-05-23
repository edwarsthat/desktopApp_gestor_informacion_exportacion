/* eslint-disable prettier/prettier */
import { useEffect } from 'react'
import * as strings from './json/strings_ES.json'
import { crear_request_guardar } from './functions/functions'
import useAppContext from '@renderer/hooks/useAppContext'
import '@renderer/css/components.css'
import '@renderer/css/form.css'
import { useIngresoLotesData } from './hooks/useIngresoLotesData'
import useForm from '@renderer/hooks/useForm'
import FormInput from '@renderer/components/UI/components/Forminput'
import { formSchema, formType, initialValues } from './validations/ingresoLotesValidations'
import FormSelect from '@renderer/components/UI/components/FormSelect'

export default function IngresoFruta(): JSX.Element {
  const { messageModal, setLoading, loading } = useAppContext()
  const { enf, enf8, obtener_ef, obtenerTipoFruta, tiposFrutas, prediosDatos, obtenerPredios } =
    useIngresoLotesData()
  const { formState, handleChange, resetForm, formErrors, validateForm } =
    useForm<formType>(initialValues)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true)
        await obtener_ef()
        await obtenerPredios()
        await obtenerTipoFruta()
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
        dataLote: {...data, GGN: data.GGN === 'true'},
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
      const response = await window.api.server2(request)
      if (response.status !== 200) throw new Error(`Error ${response.status}: ${response.message}`)

      resetForm()
      await obtener_ef()
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
        <FormSelect
          name="ef"
          value={formState.ef}
          label="EF-"
          onChange={handleChange}
          error={formErrors.ef}
          data={[
            { _id: enf, name: enf },
            { _id: enf8, name: enf8 }
          ]}
        />

        <FormSelect
          name="nombrePredio"
          value={formState.nombrePredio}
          label={strings.input_predios}
          onChange={handleChange}
          error={formErrors.nombrePredio}
          data={prediosDatos.map((item) => ({ _id: item._id, name: item.PREDIO }))}
        />

        <FormSelect
          name="tipoFruta"
          value={formState.tipoFruta}
          label="Tipo de fruta"
          onChange={handleChange}
          error={formErrors.tipoFruta}
          data={tiposFrutas.map((item) => ({ _id: item, name: item }))}
        />

        <FormSelect
          name="GGN"
          value={formState.GGN}
          label="GGN"
          onChange={handleChange}
          error={formErrors.GGN}
          data={[{name:"Si", _id:"true"}, {name:"No", _id:"false"}]}
        />

        <FormInput
          name="canastillasPropias"
          label={strings.numeroCanastillasPropias}
          type="text"
          value={formState.canastillasPropias}
          onChange={handleChange}
          error={formErrors.canastillasPropias}
        />

        <FormInput
          name="canastillasPrestadas"
          label={strings.numeroCanastillasPrestadas}
          type="text"
          value={formState.canastillasPrestadas}
          onChange={handleChange}
          error={formErrors.canastillasPrestadas}
        />

        <FormInput
          name="canastillasVaciasPropias"
          label={strings.numeroCanastillasVaciasPropias}
          type="text"
          value={formState.canastillasVaciasPropias}
          onChange={handleChange}
          error=""
        />

        <FormInput
          name="canastillasVaciasPrestadas"
          label={strings.numeroCanastillasVaciasPrestadas}
          type="text"
          value={formState.canastillasVaciasPrestadas}
          onChange={handleChange}
          error={formErrors.canastillasVaciasPrestadas}
        />

        <FormInput
          name="kilos"
          label={strings.kilos}
          type="text"
          value={formState.kilos}
          onChange={handleChange}
          error={formErrors.kilos}
        />

        <FormInput
          name="placa"
          label={strings.placa}
          type="text"
          value={formState.placa}
          onChange={handleChange}
          error={formErrors.placa}
        />

        <FormInput
          name="fecha_estimada_llegada"
          label={strings.fecha_estimada_llegada}
          type="datetime-local"
          value={formState.fecha_estimada_llegada}
          onChange={handleChange}
          error={formErrors.fecha_estimada_llegada}
        />

        <FormInput
          name="numeroPrecintos"
          label="N°. Precintos"
          type="text"
          value={formState.numeroPrecintos}
          onChange={handleChange}
          error={formErrors.numeroPrecintos}
        />

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
