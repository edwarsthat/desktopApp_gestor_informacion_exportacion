/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import useForm from "@renderer/hooks/useForm";
import useGetSysData from "@renderer/hooks/useGetSysData"
import { useEffect } from "react";
import { formType, initialValues } from "./validations/form";
import FormSelect from "@renderer/components/UI/components/FormSelect";


export default function IngresoEf8(): JSX.Element {
    const { messageModal, setLoading, loading } = useAppContext()
    const { obtenerPredios, proveedores, obtenerEf8, ef8 } = useGetSysData({});
    const { formState, handleChange, resetForm, formErrors, validateForm } =  useForm<formType>(initialValues)

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true)
                await obtenerPredios()
                await obtenerEf8()
            } catch (err) {
                if (err instanceof Error) {
                    messageModal('error', err.message)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])
    return (
        <div>
            <div className="navBar"></div>
            <div>
                <h2>Ingreso EF8-</h2>
                <hr />
            </div>
            <form className="form-container" >
                <h3>{ef8}</h3>
                <FormSelect
                    name="predio"
                    value={formState.predio}
                    label="Nombre del predio"
                    onChange={handleChange}
                    error={formErrors.predio}
                    data={proveedores.map((item) => ({ _id: item._id, name: item.PREDIO }))}
                />
            </form>
        </div>
    )
}