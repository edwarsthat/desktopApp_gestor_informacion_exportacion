/* eslint-disable prettier/prettier */
import { contenedoresType } from "@renderer/types/contenedoresType"
import { useEffect } from "react";
import useAppContext from "@renderer/hooks/useAppContext";
import { clienteType } from "@renderer/types/clientesType";
import { formLabels, formSchema, formType, initialForm } from "../validations/validations";
import useForm from "@renderer/hooks/useForm";
import FormInput from "@renderer/components/UI/components/Forminput";
import FormSelect from "@renderer/components/UI/components/FormSelect";
import FormMultipleSelect from "@renderer/components/UI/components/FormMultipleSelect";
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";


type propsType = {
    contenedor: contenedoresType | undefined
    clientes: clienteType[] | undefined
    open: boolean
    onClose: () => void
}

export default function ModalInfoContenedor({ contenedor, onClose, clientes, open }: propsType): JSX.Element {
    const { messageModal, loading, setLoading } = useAppContext();
    const tiposFruta = useTipoFrutaStore(state => state.tiposFruta)
    const tiposCalidad = useTipoFrutaStore(state => state.tiposCalidades)
    const calibres = tiposFruta.flatMap(item => item.calibres)
    const { formState, handleChange, setFormState, formErrors, handleArrayChange, validateForm, resetForm } = useForm<formType>(initialForm)

    useEffect(() => {
        const obj = { ...formState }
        obj.calibres = contenedor?.infoContenedor?.calibres || [""]
        obj.calidad = contenedor?.infoContenedor?.calidad.map(cal => cal._id) || [""]
        obj.cliente = contenedor?.infoContenedor?.clienteInfo?._id || ""
        obj.defecto = contenedor?.infoContenedor?.defecto || ""
        obj.fechaCreacion = contenedor?.infoContenedor?.fechaCreacion || ""
        obj.fechaInicio = contenedor?.infoContenedor?.fechaInicio || ""
        obj.fechaInicioReal = contenedor?.infoContenedor?.fechaInicioReal || ""
        obj.fechaEstimadaCargue = contenedor?.infoContenedor?.fechaEstimadaCargue || ""
        obj.fechaFinalizado = contenedor?.infoContenedor?.fechaFinalizado || ""
        obj.fechaSalida = contenedor?.infoContenedor?.fechaSalida || ""
        obj.mancha = contenedor?.infoContenedor?.mancha || ""
        obj.observaciones = contenedor?.infoContenedor?.observaciones || ""
        obj.sombra = contenedor?.infoContenedor?.sombra || ""
        obj.tipoCaja = contenedor?.infoContenedor?.tipoCaja || [""]
        obj.tipoFruta = contenedor?.infoContenedor?.tipoFruta.map(tf => tf._id) || [""]
        obj.verdeManzana = contenedor?.infoContenedor?.verdeManzana || ""
        setFormState(obj)
    }, [])

    const modificarContenedor = async (): Promise<void> => {
        try {
            setLoading(true)
            const valid = validateForm(formSchema)
            if(!valid){
                return;
            }
            const request = {
                action: "put_inventarios_programacion_contenedores",
                data: formState,
                idContenedor: contenedor?._id
            }
            const response = await window.api.server2(request)
            if(response.status !== 200){
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            messageModal("success", "Modificado con exito!")
            resetForm();
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false);
            onClose();
        }
    }
    if (contenedor === undefined) {
        return (
            <div>No hay información del contenedor</div>
        )
    }

    return (
        <dialog open={open} className="dialog-container">
            <div className="dialog-header">
                <h3>Informacion Contenedor</h3>
                <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>

            </div>
            <div className="dialog-body">
                {Object.entries(formLabels).map(([key, label]) => {
                    if (key.startsWith("fecha")) {
                        return (
                            <FormInput
                                key={key}
                                name={key}
                                label={label}
                                type="date"
                                value={formState[key]}
                                onChange={handleChange}
                                error={formErrors[key]}
                            />
                        )
                    } else if (key === "cliente" && clientes !== undefined) {
                        return (
                            <FormSelect
                                key={key}
                                name={key}
                                value={formState[key]}
                                label={label}
                                onChange={handleChange}
                                error={formErrors[key]}
                                data={clientes.map((item) => ({ _id: item._id, name: item.CLIENTE }))}
                            />
                        )
                    } else if (key === "tipoFruta") {
                        return (
                            <FormMultipleSelect
                                key={key}
                                name={key}
                                value={formState[key] as string[]}
                                label={label}
                                onChange={handleArrayChange}
                                error={formErrors[key]}
                                data={tiposFruta.map((item) => ({ _id: item._id, name: item.tipoFruta }))}
                            />
                        )
                    } else if (key === "calibres") {
                        return (
                            <FormMultipleSelect
                                key={key}
                                name={key}
                                value={formState[key] as string[]}
                                label={label}
                                onChange={handleArrayChange}
                                error={formErrors[key]}
                                data={calibres.map((item) => ({ _id: item, name: item }))}
                            />
                        )
                    } else if (key === "calidad") {
                        return (
                            <FormMultipleSelect
                                key={key}
                                name={key}
                                value={formState[key] as string[]}
                                label={label}
                                onChange={handleArrayChange}
                                error={formErrors[key]}
                                data={tiposCalidad.map((item) => ({ _id: item._id, name: item.nombre }))}
                            />
                        )
                    }

                    return <FormInput
                        key={key}
                        name={key}
                        label={label}
                        type="text"
                        value={formState[key]}
                        onChange={handleChange}
                        error={formErrors[key]}
                    />
                })}
            </div>
            <div className="dialog-footer">
                <button className="default-button-agree" disabled={loading} onClick={modificarContenedor}>Modificar</button>
                <button className="default-button-error" onClick={onClose}>Cerrar</button>
            </div>
        </dialog>
    )
}
