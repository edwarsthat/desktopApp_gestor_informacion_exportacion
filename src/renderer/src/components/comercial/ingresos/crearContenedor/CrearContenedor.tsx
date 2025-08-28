/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import { FormStateType, initForm, schemaForm } from './validations/validations'
import useAppContext from '@renderer/hooks/useAppContext'
import "@renderer/css/components.css"
import "@renderer/css/form.css"
import useGetSysData from '@renderer/hooks/useGetSysData'
import { formLabels } from './validations/validations'
import FormSelect from '@renderer/components/UI/components/FormSelect'
import FormInput from '@renderer/components/UI/components/Forminput'
import FormMultipleSelect from '@renderer/components/UI/components/FormMultipleSelect'
import useForm from '@renderer/hooks/useForm'
import { calidadesType } from '@renderer/types/tiposFrutas'

export default function CrearContenedor(): JSX.Element {
  const { messageModal, setLoading, loading } = useAppContext();
  const { obtenerClientes, clientes, tiposFruta2, obtenerTipoFruta2 } = useGetSysData({});
  const { formState, formErrors, handleChange, handleArrayChange, validateForm, resetForm } = useForm<FormStateType>(initForm);
  const [calidad, setCalidad] = useState<calidadesType[]>([]);
  const [calibres, setCalibres] = useState<string[]>([]);
  // Estado local para tipoCaja
  const [inputTipoCaja, setInputTipoCaja] = useState<string>('');
  const [inputPesoCaja, setInputPesoCaja] = useState<string>('');
  // Agregar nuevo tipo de caja al formState
  const handleInputTipoCaja = (): void => {
    if (!inputTipoCaja || !inputPesoCaja) return;
    const newBoxes = [...(formState.tipoCaja as string[]), `${inputTipoCaja}-${inputPesoCaja}`];
    handleArrayChange({ target: { name: 'tipoCaja', value: newBoxes } });
    setInputTipoCaja('');
    setInputPesoCaja('');
  };
  // Eliminar tipo de caja al hacer click
  const handleEliminarTipoCaja = (caja: string): void => {
    const filtered = (formState.tipoCaja as string[]).filter(item => item !== caja);
    handleArrayChange({ target: { name: 'tipoCaja', value: filtered } });
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        await obtenerClientes();
        await obtenerTipoFruta2();
      } catch (err) {
        if (err instanceof Error) {
          messageModal("error", `Error al cargar los datos: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [])

  useEffect(() => {
    const arrcalidad: calidadesType[] = []
    const arrcalibres: string[] = [];
    tiposFruta2.forEach((item) => {
      if (
        Array.isArray(formState.tipoFruta) &&
        formState.tipoFruta.includes(item._id)
      ) {
        arrcalidad.push(...item.calidades);
        arrcalibres.push(...item.calibres);
      }
    });
    setCalidad(arrcalidad);
    setCalibres(arrcalibres);
  }, [formState.tipoFruta])


  const guardarDatos: React.FormEventHandler<HTMLFormElement> = async (event) => {
    try {
      setLoading(true);
      event.preventDefault();
      const isValid = validateForm(schemaForm);
      if (!isValid) { return; }

      const request = {
        data: formState,
        action: "post_comercial_contenedor"
      };

      const response = await window.api.server2(request)
      if (response.status !== 200) {
        throw new Error(`Error al crear el contenedor: ${response.status}: ${response.message}`);
      }
      messageModal("success", 'Contenedor creado con exito!');
      resetForm();
    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", `${e.message}`);
      }
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className='componentContainer'>
      <div className='navBar'></div>
      <h2 >
        Crear contenedor
      </h2>
      <hr />
      <form className="form-container" onSubmit={guardarDatos}>
        {Object.entries(formLabels).map(([key, value]) => {
          if (key === "cliente") {
            return (
              <FormSelect
                key={key}
                name={key}
                value={formState[key] as string}
                label={value}
                onChange={handleChange}
                error={formErrors[key as keyof FormStateType]}
                data={clientes.map((item) => ({ _id: item._id, name: item.CLIENTE }))}
              />
            )
          } else if (key === "tipoFruta") {
            return (
              <FormMultipleSelect
                key={key}
                name={key}
                value={formState[key] as string[]}
                label={value}
                onChange={handleArrayChange}
                error={formErrors[key as keyof FormStateType]}
                data={tiposFruta2.map((item) => ({ _id: item._id, name: item.tipoFruta }))}
              />
            )
          }
          else if (key === "calidad") {
            return (
              <FormMultipleSelect
                key={key}
                name={key}
                value={formState[key] as string[]}
                label={value}
                onChange={handleArrayChange}
                error={formErrors[key as keyof FormStateType]}
                data={calidad.map((item) => ({ _id: item._id, name: item.nombre }))}
              />
            )
          }
          else if (key === "calibres") {
            return (
              <FormMultipleSelect
                key={key}
                name={key}
                value={formState[key] as string[]}
                label={value}
                onChange={handleArrayChange}
                error={formErrors[key as keyof FormStateType]}
                data={calibres.map((item) => ({ _id: item, name: item }))}
              />
            )
          } else if (key === "tipoCaja") {
            return (
              <div key={key} className="tipo-caja-group">
                <div className="tipo-caja-inputs">
                  <select className="defaultSelect" value={inputTipoCaja} onChange={(e): void => setInputTipoCaja(e.target.value)}>
                    <option value="">Tipo caja</option>
                    <option value="B">B</option>
                    <option value="G">G</option>
                    <option value="K">K</option>
                    <option value="Bulto">Bulto</option>
                  </select>
                  <span className="tipo-caja-dash">-</span>
                  <input
                    type="text"
                    className="tipo-caja-text"
                    placeholder="Peso"
                    value={inputPesoCaja}
                    onChange={(e): void => setInputPesoCaja(e.target.value)}
                  />
                  <button
                    type="button"
                    className="tipo-caja-add-btn"
                    onClick={handleInputTipoCaja}
                  >
                    +
                  </button>
                </div>
                <div className="tipo-caja-list">
                  {(formState.tipoCaja as string[]).map((caja, index) => (
                    <button
                      type="button"
                      className="tipo-caja-item"
                      key={index}
                      onClick={(): void => handleEliminarTipoCaja(caja)}
                    >
                      {caja}
                    </button>
                  ))}
                </div>
              </div>
            )
          } else if (key === "fechaInicioProceso" || key === "fechaEstimadaCargue") {
            return (
              <FormInput
                key={key}
                name={key}
                label={value}
                type="date"
                value={formState[key] as string}
                onChange={handleChange}
                error={formErrors[key]}
              />
            )
          } else {
            return (
              <FormInput
                key={key}
                name={key}
                label={value}
                type="text"
                value={formState[key] as string}
                onChange={handleChange}
                error={formErrors[key]}
              />
            )
          }
        })}
        <div className="defaultSelect-button-div">
          <button disabled={loading} type="submit">
            Guardar
          </button>
        </div>
      </form>

    </div>
  )
}
