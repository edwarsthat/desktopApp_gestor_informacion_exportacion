/* eslint-disable prettier/prettier */
import { useEffect } from "react";
import { formInit, formInitType, formSchema } from "../validations/form";
import useAppContext from "@renderer/hooks/useAppContext";
import { request_guardar_cambios } from "../services/request";
import { recordLotesType } from "@renderer/types/recorLotesType";
import useGetSysData from "@renderer/hooks/useGetSysData";
import useForm from "@renderer/hooks/useForm";
import FormInput from "@renderer/components/UI/components/Forminput";
import FormSelect from "@renderer/components/UI/components/FormSelect";
import { loteEF8Type } from "@renderer/types/loteEf8";

type propsType = {
    setOpenModal: (e) => void
    loteSeleccionado: recordLotesType | undefined | loteEF8Type
    obtenerData: () => void
    openModal: boolean
}

export default function ModalModificarLote(props: propsType): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext()
    const {
        formState,
        handleChange,
        fillForm,
        validateForm,
        formErrors,
        resetForm
    } = useForm<formInitType>(formInit);

    const {
        obtenerPredios,
        proveedores,
        obtenerTipoFruta,
        tiposFruta
    } = useGetSysData({})

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true)
                await obtenerTipoFruta()
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
        if (props.loteSeleccionado !== undefined) {
            const formData = { ...formState }
            if ('documento' in props.loteSeleccionado) {
                formData.enf = String(props.loteSeleccionado.documento.enf)
                formData.predio = String(props.loteSeleccionado.documento.predio?._id)
                formData.observaciones = String(props.loteSeleccionado.documento.observaciones)
                formData.placa = String(props.loteSeleccionado.documento.placa)
                formData.tipoFruta = String(props.loteSeleccionado.documento.tipoFruta)
                formData.fecha_ingreso_inventario = String(props.loteSeleccionado.documento.fecha_ingreso_inventario)
                formData.canastillas = String(props.loteSeleccionado.documento.canastillas)
                formData.kilos = String(props.loteSeleccionado.documento.kilos)
                formData.GGN = String(props.loteSeleccionado.documento.GGN)
            } 
            fillForm(formData)
        }
    }, [props.loteSeleccionado])


    const handleGuardar = async (e): Promise<void> => {
        e.preventDefault()
        try {
            setLoading(true)
            const result = validateForm(formSchema)
            if (!result) return
            const request = request_guardar_cambios(props.loteSeleccionado, formState)
            const response = await window.api.server2(request)

            if (response.status !== 200)
                throw new Error(response.message)
            messageModal("success", "Datos modificados con exito")
            props.obtenerData()
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
        props.setOpenModal(false)
    }

    return (
        <dialog open={props.openModal} className="dialog-modal">
            <div className="dialog-header">
                <h3>Modificar ingreso EF1</h3>
                <button className="close-button" aria-label="Cerrar" onClick={closeModal}>×</button>
            </div>

            <div className="dialog-body">
                <div className="form-field">
                    <FormInput
                        name="enf"
                        label="EF-"
                        type="text"
                        value={formState.enf}
                        onChange={handleChange}
                        error={formErrors.enf} />
                </div>
                <div className="form-field">
                    <FormSelect
                        name="predio"
                        value={formState.predio}
                        label="Predios"
                        onChange={handleChange}
                        error={formErrors.predio}
                        data={proveedores.map((item) => ({ _id: item._id, name: item.PREDIO }))}
                    />
                </div>
                <div className="form-field">
                    <FormInput
                        name="kilos"
                        label="Kilos"
                        type="text"
                        value={formState.kilos}
                        onChange={handleChange}
                        error={formErrors.kilos} />
                </div>
                <div className="form-field">
                    <FormInput
                        name="canastillas"
                        label="Canastillas"
                        type="text"
                        value={formState.canastillas}
                        onChange={handleChange}
                        error={formErrors.canastillas} />
                </div>
                <div className="form-field">
                    <FormSelect
                        name="tipoFruta"
                        value={formState.tipoFruta}
                        label="Tipo de fruta"
                        onChange={handleChange}
                        error={formErrors.tipoFruta}
                        data={tiposFruta.map((item) => ({ _id: item, name: item }))}
                    />
                </div>
                <div className="form-field">
                    <FormSelect
                        name="GGN"
                        value={formState.GGN}
                        label="GGN"
                        onChange={handleChange}
                        error={formErrors.GGN}
                        data={[
                            { _id: "true", name: "Si" }, { _id: "false", name: "No" }
                        ]}
                    />
                </div>
                <div className="form-field">
                    <FormInput
                        name="observaciones"
                        label="Observaciones"
                        type="text"
                        value={formState.observaciones}
                        onChange={handleChange}
                        error={formErrors.observaciones} />
                </div>
                <div className="form-field">
                    <FormInput
                        name="placa"
                        label="Placa"
                        type="text"
                        value={formState.placa}
                        onChange={handleChange}
                        error={formErrors.placa} />
                </div>
                <div className="form-field">
                    <FormInput
                        name="fecha_ingreso_inventario"
                        label="Fecha ingreso"
                        type="date"
                        value={formState.fecha_ingreso_inventario}
                        onChange={handleChange}
                        error={formErrors.fecha_ingreso_inventario} />
                </div>
            </div>
            <div className="dialog-footer">
                <button className="default-button-agree" onClick={handleGuardar} disabled={loading}>Guardar</button>
                <button className="default-button-error" onClick={closeModal}>Cerrar</button>
            </div>


        </dialog>
    )
}