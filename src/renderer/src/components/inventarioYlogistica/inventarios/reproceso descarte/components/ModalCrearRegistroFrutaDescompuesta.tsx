/* eslint-disable prettier/prettier */

import useForm from "@renderer/hooks/useForm"
import { formType, inventarioDescarteType } from "../types/types"
import { descompuestaSchema, formDescompuestaKeys, formDescompuestaType, initFormDescaompuesta, validateKilos } from "../validations/validateRequest"
import useAppContext from "@renderer/hooks/useAppContext"
import { sumatoriaTotalForm } from "../function/sumatorias"
import { useEffect } from "react"

type propsType = {
  open: boolean,
  onClose: () => void
  fruta: inventarioDescarteType
  tipoFruta: string
  formInventario: formType
  resetInventarioForm: () => void
}


export default function ModalCrearRegistroFrutaDescompuesta({
  open, onClose, tipoFruta, fruta, formInventario, resetInventarioForm
}: propsType): JSX.Element {
  const { messageModal, setLoading } = useAppContext();
  const { handleChange, formState, formErrors, validateForm, resetForm } = useForm<formDescompuestaType>(initFormDescaompuesta)


  const guardarDescompuesta = async (): Promise<void> => {
    try {
      setLoading(true)
      if (tipoFruta === '') throw new Error("Seleccione un tipo de fruta")
      const result = validateForm(descompuestaSchema)
      if (!result) return
      const validarFruta = validateKilos(fruta, formInventario)
      if (!validarFruta) throw new Error("Error, mas kilos de salida de los que hay en el inventario")
      const kilos = sumatoriaTotalForm(formInventario)
      if (kilos <= 0) throw new Error("No se peude crear registro descompuesta por 0 kilos")
      const request = {
        action: "post_inventarios_frutaDescarte_frutaDescompuesta",
        data: formState,
        inventario: formInventario
      }

      const response = await window.api.server2(request)
      if (response.status !== 200) {
        throw new Error(`Code ${response.status}: ${response.message}`)
      }
      messageModal("success", "Fruta descompuesta registrada")
      resetForm()
      resetInventarioForm()
      onClose()
    } catch (err) {
      if (err instanceof Error) {
        messageModal("error", err.message)
        onClose()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog open={open} className='"dialog-container"'>
      <div className="dialog-header">
        <h3>Ingresar Fruta descompuesta</h3>
        <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>
      </div>
      <div className="dialog-body">
        {Object.entries(formDescompuestaKeys).map(([key, value]) => (
          <div className="form-field" key={key}>
            <label htmlFor={key}>{value}</label>
            <textarea
              id={key}
              name={key}
              onChange={handleChange}
              value={formState[key]}
            />
            {formErrors[key] && <p className="form-error">{formErrors[key]}</p>}

          </div>
        ))}
      </div>
      <div className="dialog-footer">
        <button className="default-button-agree" onClick={guardarDescompuesta}>Guardar</button>
        <button className="default-button-error" onClick={onClose}>Cerrar</button>
      </div>
    </dialog >
  )
}
