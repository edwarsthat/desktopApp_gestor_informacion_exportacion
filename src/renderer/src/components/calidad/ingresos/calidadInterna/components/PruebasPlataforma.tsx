/* eslint-disable prettier/prettier */
import { formType } from '../validations/validation'


type propsType = {
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
  formState: formType
  formErrors: Partial<Record<keyof formType | string, string>>

}

export default function PruebasPlataforma({handleChange, formState, formErrors}: propsType): JSX.Element {
  return (
    <div className="calidad-interna-pruebas-div">
      <h2>Pruebas de plataforma</h2>
      <div className="muestra">
        <p>N° muestra 1</p>
        <input
          className='defaultSelect'
          type="text"
          name='brix1'
          placeholder="Brix"
          onChange={handleChange}
          value={formState.brix1}
        />
        {formErrors.brix1 && (
          <p className="text-red-600 text-sm ml-2">{formErrors.brix1}</p>
        )}
        <input
          className='defaultSelect'
          type="text"
          placeholder="Acidez"
          name='acidez1'
          onChange={handleChange}
          value={formState.acidez1}
        />
        {formErrors.acidez1 && (
          <p className="text-red-600 text-sm ml-2">{formErrors.acidez1}</p>
        )}
      </div>
      <div className="muestra">
        <p>N° muestra 2</p>
        <input
          className='defaultSelect'
          type="text"
          placeholder="Brix"
          name='brix2'
          onChange={handleChange}
          value={formState.brix2}
        />
        {formErrors.brix2 && (
          <p className="text-red-600 text-sm ml-2">{formErrors.brix2}</p>
        )}
        <input
          className='defaultSelect'
          type="text"
          placeholder="Acidez"
          name='acidez2'
          onChange={handleChange}
          value={formState.acidez2}
        />
        {formErrors.acidez2 && (
          <p className="text-red-600 text-sm ml-2">{formErrors.acidez2}</p>
        )}
      </div>
      <div className="muestra">
        <p>N° muestra 3</p>
        <input
          className='defaultSelect'
          type="text"
          placeholder="Brix"
          name='brix3'
          onChange={handleChange}
          value={formState.brix3}
        />
        {formErrors.brix3 && (
          <p className="text-red-600 text-sm ml-2">{formErrors.brix3}</p>
        )}
        <input
          className='defaultSelect'
          type="text"
          placeholder="Acidez"
          name='acidez3'
          onChange={handleChange}
          value={formState.acidez3}
        />
        {formErrors.acidez3 && (
          <p className="text-red-600 text-sm ml-2">{formErrors.acidez3}</p>
        )}
      </div>
    </div>
  )
}
