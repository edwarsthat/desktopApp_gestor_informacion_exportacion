/* eslint-disable prettier/prettier */


import useAppContext from "@renderer/hooks/useAppContext";
import { proveedoresType } from "@renderer/types/proveedoresType";
import { inventarioCanastillasType } from "@renderer/types/inventarioCanastillas";
import { clientesNacionalesType } from "@renderer/types/clientesType";
import FormInput from "@renderer/components/UI/components/Forminput";
import { FormCanastillasType, formSchema, initialFormCanastillasValues } from "../validation/validation";
import useForm from "@renderer/hooks/useForm";


type propsType = {
    handlereFetch: () => Promise<void>
    proveedores: proveedoresType[]
    inventario: inventarioCanastillasType
    clientes: clientesNacionalesType[]
}

export default function FormularioIngresosalida(props: propsType): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext();
    const {
        handleChange,
        formState,
        formErrors,
        validateForm,
        resetForm
    } = useForm<FormCanastillasType>(initialFormCanastillasValues)

    const handleGuardar = async (e): Promise<void> => {
        e.preventDefault()
        try {
            const result = validateForm(formSchema)
            if (!result) return
            setLoading(true)

            const request = {
                action: "post_inventarios_canastillas_registro",
                data: formState
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Canastillas movidas con exito")

            await props.handlereFetch()
            resetForm();
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }


    const dataList = (): JSX.Element => {
        return (
            <>
                {props.proveedores.map(item => (
                    <option value={item._id} key={item._id}>{item.PREDIO}</option>
                ))}
                {props.clientes.map(item => (
                    <option value={item._id} key={item._id}>{item.cliente}</option>
                ))}
            </>
        )
    }
    const canastillasPredioCliente = (): JSX.Element => {
        const proveedor = props.proveedores.find(prov => prov._id === formState.origen)
        const cliente = props.clientes.find(cli => cli._id === formState.origen)
        if (proveedor) {
            return (
                <p>{proveedor.canastillas} canastillas</p>
            )
        } else if (cliente) {
            return (
                <p>{cliente.canastillas} canastillas</p>
            )
        } else {
            return (
                <p></p>
            )
        }
    }

    return (

        <form className="form-container" onSubmit={handleGuardar}>

            <label>Tipo de Acción</label>
            <select onChange={handleChange} name="accion">
                <option value=""></option>
                <option value="ingreso">Ingreso</option>
                <option value="salida">Salida</option>
                <option value="traslado">Traslado</option>
            </select>

            <FormInput
                name="canastillas"
                label="Cantidad"
                type='text'
                value={formState.canastillas}
                onChange={handleChange}
                error={formErrors.canastillas} />

            <FormInput
                name="canastillasPrestadas"
                label="Cantidad Prestadas"
                type='text'
                value={formState.canastillasPrestadas}
                onChange={handleChange}
                error={formErrors.canastillasPrestadas} />

            <label>Origen</label>
            <select
                name="origen"
                onChange={handleChange}
                value={formState.origen}>
                <option value=""></option>
                {dataList()}
            </select>
            {canastillasPredioCliente()}

            <label>Destino</label>
            <select
                onChange={handleChange}
                value={formState.destino}
                name="destino">
                <option value=""></option>
                {dataList()}
            </select>

            <FormInput
                name="fecha"
                label="Fecha"
                type='date'
                value={formState.fecha}
                onChange={handleChange}
                error={formErrors.fecha} />

            <FormInput
                name="remitente"
                label="Remitente"
                type='text'
                value={formState.remitente}
                onChange={handleChange}
                error={formErrors.remitente} />

            <FormInput
                name="destinatario"
                label="Destinatario"
                type='text'
                value={formState.destinatario}
                onChange={handleChange}
                error={formErrors.destinatario} />

            <label>Observaciones</label>
            <textarea
                value={formState?.observaciones}
                onChange={handleChange}
                name="observaciones"
            />

            <div className='defaultSelect-button-div'>
                <button disabled={loading} type='submit'>Guardar</button>
            </div>

        </form>


    )
}
