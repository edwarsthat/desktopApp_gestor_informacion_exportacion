/* eslint-disable prettier/prettier */

import { proveedoresType } from "@renderer/types/proveedoresType"
import ProveedorComponente from "./ProveedorComponente"
import React, { useEffect, useState } from "react"
import useAppContext from "@renderer/hooks/useAppContext"
import { tiposFrutasType } from "@renderer/types/tiposFrutas"

type propsType = {
    proveedores: proveedoresType[] | undefined
    setProveedores: (e) => void
    tiposFrutas: tiposFrutasType[] | undefined
    setSelectedProveedores: (proveedor: React.SetStateAction<proveedoresType[] | undefined>) => void
    selectedProveedores: proveedoresType[] | undefined
}

type filtroType = {
    tipoFruta: string
    predio: string
}

export default function ListaProveedores({
    proveedores,
    setProveedores,
    tiposFrutas,
    selectedProveedores,
    setSelectedProveedores
}: propsType): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [filtro, setFiltro] = useState<filtroType>({
        tipoFruta: '',
        predio: ''
    })
    const [data, setData] = useState<proveedoresType[]>()

    useEffect(() => {
        if (proveedores) {
            setData(proveedores)
        }
    }, [proveedores])

    useEffect(() => {
        if (proveedores) {
            let new_data = proveedores

            if (filtro.tipoFruta !== '') {
                new_data = new_data.filter(proveedor => (
                    proveedor.tipo_fruta && Object.keys(proveedor.tipo_fruta).length > 0 ?
                        Object.keys(proveedor.tipo_fruta).some(
                            fruta => String(fruta).toLowerCase().includes(filtro.tipoFruta.toLowerCase())
                        )
                        : false
                ))
            }
            if (filtro.predio !== '') {
                new_data = new_data.filter(proveedor => (
                    proveedor.PREDIO.toLowerCase().includes(filtro.predio.toLowerCase())
                ))
            }
            setData(new_data)

        }
    }, [filtro])

    const handleChange = (event): void => {
        const { name, value } = event.target;
        setFiltro((prev) => {
            return { ...prev, [name]: value }
        });
    };

    const precioFijo = async (): Promise<void> => {
        try{
            setLoading(true)
            if(!selectedProveedores) throw new Error("Seleccione un proveedor")
            if(!proveedores) throw new Error("No hay proveedores")
            const request = {
                action: "put_comercial_precios_proveedores_precioFijo",
                data: selectedProveedores.map(item => item._id)
            }
            const response = await window.api.server2(request)
            if(response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Modificado con exito")

            const newProveedores = proveedores.map(prov => {
                if(selectedProveedores?.findIndex(item => item._id === prov._id) !== -1){
                    prov.precioFijo = !prov.precioFijo
                    return prov
                } else {
                    return prov
                } 
            })
            setProveedores([...newProveedores])
        } catch(err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    const handleCheckAll = (): void => {
        if(data){
            const dataFilter = data.filter(item => !item.precioFijo)
            setSelectedProveedores(dataFilter)
        }
    }

    return (
        <>
            <div className="filtro_proveedores-div">
                <div>
                    <label className="search-label">
                        Predio:
                    </label>
                    <div className="search-container">
                        <input
                            value={filtro.predio}
                            onChange={handleChange}
                            type="text"
                            name="predio"
                            className="search-input"
                        />
                    </div>
                </div>
                <div>
                    <label className="tool-select-label" >
                        Tipo de fruta:
                    </label>
                    <select
                        data-testid="conercial-precios-proveedores-select-tipo-fruta"
                        value={filtro.tipoFruta}
                        onChange={handleChange}
                        name="tipoFruta"
                        className="tool-select">
                        <option value=""></option>
                        {tiposFrutas && tiposFrutas.map(fruta =>
                            <option value={fruta._id} key={fruta._id}>{fruta.tipoFruta}</option>
                        )}
                    </select>
                </div>
                <button
                    onClick={precioFijo}
                    className="add-record">
                    Precio fijo
                </button>
                <button
                    onClick={handleCheckAll}
                    className="add-record">
                    Seleccionar todo
                </button>
            </div>

            {proveedores === undefined ?

                <div>Cargando...</div>
                :
                <div className="comercial-precios-proveedores-lista" >
                    {data && data.map((proveedor, index) => (
                        <ProveedorComponente
                            selectedProveedores={selectedProveedores}
                            setSelectedProveedores={setSelectedProveedores}
                            proveedor={proveedor}
                            key={proveedor._id + index} />
                    ))}
                </div>
            }
        </>
    )
}