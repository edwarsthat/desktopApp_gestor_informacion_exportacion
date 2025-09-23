/* eslint-disable prettier/prettier */
import useAppContext from '@renderer/hooks/useAppContext'
import { lotesType } from '@renderer/types/lotesType'
import { useEffect } from 'react'
import "../../../../../css/modal-style.css"
import useGetCatalogData from '@renderer/hooks/useGetCatalogData'
import FormSelect from '@renderer/components/UI/components/FormSelect'
import useForm from '@renderer/hooks/useForm'
import { formSchema, formType, initialForm } from '../validations/desverdizado'
import FormInput from '@renderer/components/UI/components/Forminput'


type vaciadoType = {
  loteSeleccionado: lotesType | undefined
  open: boolean
  onClose: () => void
}

export default function Desverdizado({
  open, onClose, loteSeleccionado
}: vaciadoType): JSX.Element {
  const { obtenerCuartosDesverdizados, cuartosDesverdizados } = useGetCatalogData();
  const { formState, formErrors, handleChange, validateForm, resetForm } = useForm<formType>(initialForm);
  const { loading, setLoading, messageModal } = useAppContext();


  useEffect(() => {
    obtenerCuartosDesverdizados()
  }, [open])

  const desverdizar = async (): Promise<void> => {
    if (loteSeleccionado === undefined) throw new Error("Lote seleccionado no válido");
    try {
      setLoading(true)
      const result = validateForm(formSchema)
      if (!result) return

      const canastillasInt = Number(formState.canastillas)
      const propsCanastillasInt = Number(loteSeleccionado.canastillas || 0)

      if (propsCanastillasInt !== undefined && canastillasInt > propsCanastillasInt) {
        throw new Error("Error en el numero de canastillas!")
      }

      const request = {
        _id: loteSeleccionado._id,
        desverdizado: formState,
        action: 'put_inventarios_frutaSinProcesar_desverdizado',
      }

      const response = await window.api.server2(request);
      if (response.status !== 200) {
        throw new Error(`Code ${response.status}: ${response.message}`);
      }
      messageModal("success", "Fruta desverdizada con éxito");
      resetForm();
      onClose();

    } catch (e: unknown) {
      if (e instanceof Error) {
        messageModal("error", e.message)
        onClose();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog open={open} className="dialog-container">
      <div className="dialog-header">
        <h3>Desverdizar fruta</h3>
        <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>
      </div>

      <div className="dialog-body">
        <FormSelect
          name="_id"
          value={formState._id}
          label="Cuarto desverdizado"
          onChange={handleChange}
          error={formErrors._id}
          data={cuartosDesverdizados.map((item) => ({ _id: item._id, name: item.nombre }))}
        />

        <FormInput
          name="canastillas"
          label="Canastillas"
          type="text"
          value={formState.canastillas}
          onChange={handleChange}
          error={formErrors.canastillas}
        />
      </div>
      <div className="dialog-footer">
        <button className="default-button-agree" disabled={loading} onClick={desverdizar}>Guardar</button>
        <button className="default-button-error" onClick={onClose}>Cerrar</button>
      </div>
    </dialog>

  );
}

