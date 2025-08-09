/* eslint-disable prettier/prettier */
import { formType } from '../validations/validation'

type propsType = {
  handleChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void
  formState: formType
  setFormState: (e) => void
  formErrors: Partial<Record<keyof formType | string, string>>
}

export default function ContenidoZumo({handleChange, formState,setFormState, formErrors}: propsType): JSX.Element {
  const calcularPorcentaje = (): string => {
    const pesoInicial = parseFloat(formState.peso)
    const pesoZumo = parseFloat(formState.zumo)
    if (isNaN(pesoInicial) || isNaN(pesoZumo) || pesoInicial === 0) {
      return 'N/A'
    }
    const porcentaje = (pesoZumo / pesoInicial) * 100
    return porcentaje.toFixed(2)
  }

  return (
    <div className="calidad-interna-zumo-div">
      <h2>Contenido Zumo</h2>
      <input
        className='defaultSelect'
        type="text"
        placeholder="Peso inicial muestra (gr)"
        name='peso'
        onChange={handleChange}
        value={formState.peso}
      />
      {formErrors.peso && (
        <p className="text-red-600 text-sm ml-2">{formErrors.peso}</p>
      )}
      <input
        className='defaultSelect'
        type="text"
        placeholder="Peso zumo (gr)"
        name='zumo'
        onChange={handleChange}
        value={formState.zumo}
      />
      {formErrors.zumo && (
        <p className="text-red-600 text-sm ml-2">{formErrors.zumo}</p>
      )}
      <div className="checkBoxContainer">
        <label>
          Semillas
          <input
          id="semillas"
          checked={formState.semillas === 'true'}
          name="semillas"
          type="checkbox"
          onChange={(e):void => setFormState({...formState, semillas: e.target.checked ? 'true' : 'false'})}
        />
        </label>
      </div>
      <p>
        Porcentaje de Llenado de Contenido Zumo: {calcularPorcentaje()}%
      </p>
    </div>
  )
}
