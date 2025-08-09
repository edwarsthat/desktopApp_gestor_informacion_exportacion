/* eslint-disable prettier/prettier */
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore"
import { lotesType } from "@renderer/types/lotesType"
import { formType } from "../validations/validation"

type propsType = {
    lote: lotesType | undefined
    handleChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void
    formErrors: Partial<Record<keyof formType | string, string>>

}
export default function CalidadDeLaFruta({ lote, handleChange, formErrors }: propsType): JSX.Element {
    const tiposFruta = useTipoFrutaStore(state => state.tiposFruta)
    if (!lote || !lote.tipoFruta) {
        return (
            <div className="calidad-interna-calidad-div">
                <h2>Seleccione predio...</h2>
            </div>
        )
    }
    const fruta = tiposFruta.find(f => f._id === lote.tipoFruta._id)
    return (
        <div className="calidad-interna-calidad-div">
            <h2>Calidad</h2>

            <div className="radio-group">
                {fruta && fruta.calidades && fruta.calidades.map((calidad) => (
                    <label className="radio-option" key={calidad._id}>
                        <input type="radio" name="calidad" value={calidad._id} onChange={handleChange} />
                        {calidad.nombre}
                    </label>
                ))}
            </div>
            {formErrors.calidad && (
                <p className="text-red-600 text-sm ml-2">{formErrors.calidad}</p>
            )}
        </div>
    )
}


