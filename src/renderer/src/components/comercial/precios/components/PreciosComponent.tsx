/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import useForm from "@renderer/hooks/useForm"
import { proveedoresType } from "@renderer/types/proveedoresType"
import { tiposFrutasType } from "@renderer/types/tiposFrutas"
import { formInit, formType, formSchema } from "../validations/validations"

type propsType = {
    tiposFrutas: tiposFrutasType[]
    selectedProveedores: proveedoresType[] | undefined
    setSelectedProveedores: (proveedor) => void
}

export default function PreciosComponent({ tiposFrutas, selectedProveedores, setSelectedProveedores }: propsType): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const { formState, handleChange, formErrors, validateForm, resetForm } = useForm<formType>(formInit)


    const handleSave = async (): Promise<void> => {
        try {
            const result = validateForm(formSchema)
            if (!result) return
            setLoading(true)
            if (!selectedProveedores) throw new Error("No se han seleccionado proveedores")
            if (!formState?.tipoFruta || formState?.tipoFruta === '') throw new Error("Debe seleccionar un tipo de fruta")
            if (!formState?.week || formState?.week === '') throw new Error("Debe seleccionar una semana")
            console.log(formState);

            const predios = selectedProveedores.map(proveedor => proveedor._id)
            const request = {
                action: "post_comercial_precios_add_precio",
                data: {
                    ...formState,
                    predios: predios
                }
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            resetForm()
            setSelectedProveedores(undefined)
            messageModal("success", "Guardado con exito")
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <div className="filtro_proveedores-div">
                <div>
                    <label className="tool-select-label" >
                        Tipo de fruta:
                    </label>
                    <select
                        value={formState?.tipoFruta ?? ''}
                        data-testid="conercial-precios-proveedores-select-tipo-fruta2"
                        onChange={handleChange}
                        name="tipoFruta"
                        className="tool-select">
                        <option value=""></option>
                        {tiposFrutas && tiposFrutas.map(fruta =>
                            <option value={fruta._id} key={fruta._id}>{fruta.tipoFruta}</option>
                        )}
                    </select>
                    {formErrors?.tipoFruta && <span className="error-text">{formErrors.tipoFruta}</span>}
                </div>
            </div>

            <div className="comercial-precios-ingreso">
                <div className="fila">
                    <label htmlFor="week">Semana</label>
                    <input onChange={handleChange} name='week' value={formState?.week ?? ''}
                        type="week" id="week" />
                    {formErrors?.week && <span className="error-text">{formErrors.week}</span>}
                </div>

                {formState?.tipoFruta && tiposFrutas.find(fruta => fruta._id === formState.tipoFruta)?.calidades.map(calidad => (
                    <div className="fila" key={calidad._id}>
                        <label htmlFor={calidad._id}>{calidad.nombre}l</label>
                        <input onChange={handleChange} name={calidad._id}
                            type="text" id={calidad._id} placeholder={calidad.nombre} />
                        {formErrors?.[calidad._id] && <span className="error-text">{formErrors[calidad._id]}</span>}
                    </div>
                ))}

                <div className="fila">
                    <label htmlFor="frutaNac">Fruta Nacional</label>
                    <input onChange={handleChange} name='frutaNacional' value={formState?.frutaNacional ?? ''}
                        type="text" id="frutaNac" placeholder="Fruta Nacional" />
                    {formErrors?.frutaNacional && <span className="error-text">{formErrors.frutaNacional}</span>}
                </div>
                <div className="fila">
                    <label htmlFor="descarte">Descarte</label>
                    <input onChange={handleChange} name='descarte' value={formState?.descarte ?? ''}
                        type="text" id="descarte" placeholder="Descarte" />
                    {formErrors?.descarte && <span className="error-text">{formErrors.descarte}</span>}
                </div>
                <div className="fila">
                    <label htmlFor="comentario">Observaciones</label>
                    <textarea onChange={handleChange} name='comentario' value={formState?.comentario ?? ''}
                        id="comentario" placeholder="Observaciones" />
                    {formErrors?.comentario && <span className="error-text">{formErrors.comentario}</span>}
                </div>
                <button onClick={handleSave} className="btn-guardar" >
                    Guardar
                </button>
            </div>
        </>
    )
}
