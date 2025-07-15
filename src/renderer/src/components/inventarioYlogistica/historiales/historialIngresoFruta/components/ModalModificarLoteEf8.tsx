/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import useForm from "@renderer/hooks/useForm"
import { loteEF8Type } from "@renderer/types/loteEf8"
import { recordLotesType } from "@renderer/types/recorLotesType"
import { formInitEF8, formLabelsEF8, formSchemaEF8, formTypeEF8 } from "../validations/form"
import useGetSysData from "@renderer/hooks/useGetSysData"
import { useEffect } from "react"
import FormSelect from "@renderer/components/UI/components/FormSelect"
import FormInput from "@renderer/components/UI/components/Forminput"
import { formatearParaDatetimeLocal } from "@renderer/functions/fechas"
type propsType = {
    setOpenModal: (e) => void
    loteSeleccionado: recordLotesType | undefined | loteEF8Type
    obtenerData: () => void
    openModal: boolean
}
export default function ModalModificarLoteEf8({ setOpenModal, loteSeleccionado, obtenerData, openModal }: propsType): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext()
    const {
        formState,
        handleChange,
        fillForm,
        validateForm,
        formErrors,
        resetForm
    } = useForm<formTypeEF8>(formInitEF8);

    const {
        obtenerPredios,
        proveedores,
        obtenerTipoFruta2,
        tiposFruta2
    } = useGetSysData({})

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true)
                await obtenerTipoFruta2()
                await obtenerPredios()
            } catch (err) {
                if (err instanceof Error)
                    throw new Error(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    useEffect(() => {
        if (loteSeleccionado !== undefined) {
            const formData = { ...formState }
            if (!('documento' in loteSeleccionado)) {
                formData.enf = String(loteSeleccionado.enf)
                formData.predio = String(loteSeleccionado.predio?._id)
                formData.observaciones = String(loteSeleccionado.observaciones)
                formData.placa = String(loteSeleccionado.placa)
                formData.tipoFruta = String(loteSeleccionado.tipoFruta._id)
                formData.fecha_ingreso_inventario = String(loteSeleccionado.fecha_ingreso_inventario)
                formData.canastillas = String(loteSeleccionado.canastillas)
                formData.balin = String(loteSeleccionado.balin)
                formData.pareja = String(loteSeleccionado.pareja)
                formData.descarteGeneral = String(loteSeleccionado.descarteGeneral)
            }
            fillForm(formData)
        }
    }, [loteSeleccionado])


    const handleGuardar = async (e): Promise<void> => {
        e.preventDefault()
        try {
            setLoading(true)
            const result = validateForm(formSchemaEF8)
            if (!result) return
            const request = {
                action: 'put_inventarios_historiales_ingresoFruta_modificar',
                type: "loteEF8",
                _id: loteSeleccionado?._id || '',
                data: formState
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(response.message)
            messageModal("success", "Datos modificados con exito")
            obtenerData()
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        } finally {
            setLoading(false)
            closeModal()
            resetForm()
        }

    }
    const closeModal = (): void => {
        setOpenModal(false)
    }

    return (
        <dialog open={openModal} className="dialog-modal">
            <div className="dialog-header">
                <h3>Modificar ingreso EF8</h3>
                <button className="close-button" aria-label="Cerrar" onClick={closeModal}>×</button>
            </div>
            <div className="dialog-body">
                {Object.entries(formLabelsEF8).map(([key, label]) => {
                    if (key === "tipoFruta" || key === "predio") {
                        return (
                            <FormSelect
                                key={key}
                                name={key}
                                value={formState[key as keyof formTypeEF8]}
                                label={label}
                                onChange={handleChange}
                                error={formErrors[key as keyof formTypeEF8]}
                                data={
                                    key === "tipoFruta" ? 
                                        tiposFruta2.map((item) => ({ _id: item._id, name: item.tipoFruta })) : 
                                        proveedores.map((item) => ({ _id: item._id, name: item.PREDIO }))
                                }
                            />
                        )
                    } else if (key === "fecha_ingreso_inventario") {
                        return (
                            <FormInput
                                key={key}
                                name={key}
                                label={label}
                                type="datetime-local"
                                value={formatearParaDatetimeLocal(formState[key as keyof formTypeEF8])}
                                onChange={handleChange}
                                error={formErrors[key as keyof formTypeEF8]}
                            />
                        )
                    } else {
                        return (
                            <FormInput
                                key={key}
                                name={key}
                                label={label}
                                type="text"
                                value={formState[key as keyof formTypeEF8]}
                                onChange={handleChange}
                                error={formErrors[key as keyof formTypeEF8]}
                            />
                        )
                    }
                })}
            </div>
            <div className="dialog-footer">
                <button className="default-button-agree" onClick={handleGuardar} disabled={loading}>Guardar</button>
                <button className="default-button-error" onClick={closeModal}>Cerrar</button>
            </div>
        </dialog>
    )

}