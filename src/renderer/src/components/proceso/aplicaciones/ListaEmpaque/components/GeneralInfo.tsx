/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { historialLotesType } from "@renderer/types/lotesType"
import useListaEmpaqueStore from "../store/listaEmpaqueStore"



type propsType = {
    contenedores: contenedoresType[] | undefined
    lotes: historialLotesType[] | undefined
    handleShowResumen: () => void
    handleShowPredios: () => void
    showResumen: boolean
    showPredios: boolean
    handleCerrarContenedor: () => void
}


export default function GeneralInfo({ contenedores, handleShowResumen, handleShowPredios, showResumen, showPredios, handleCerrarContenedor }: propsType): JSX.Element {
    const setContenedor = useListaEmpaqueStore(state => state.setContenedor);
    const contenedor = useListaEmpaqueStore(state => state.contenedor);
    // const setLote = useListaEmpaqueStore(state => state.setLote);

    const handleContenedor = (e): void => {
        const cont = contenedores?.find(item => item._id === e.target.value)
        if (!cont) return
        setContenedor(cont)
    }
    // const handleLote = (e): void => {
    //     if(lotes === undefined) return
    //     const id = e.target.value
    //     const lote = lotes.find(item => item._id === id)
    //     if(!lote) return
    //     setLote(lote)
    // }
    return (
        <div className="proces-listaempaque-opciones">
            <div className="filtroContainer">
                <label>
                    <p>Contenedores</p>
                    <select onChange={handleContenedor} value={contenedor?._id} >
                        <option value={undefined}>{ }</option>
                        {contenedores && contenedores.map(contenedor => (
                            <option key={contenedor._id} value={contenedor._id}>
                                {contenedor.numeroContenedor +
                                    (typeof contenedor.infoContenedor.clienteInfo !== 'string' && contenedor.infoContenedor.clienteInfo.CLIENTE
                                        ? ' ' + contenedor.infoContenedor.clienteInfo.CLIENTE
                                        : ''
                                    )}
                            </option>
                        ))}
                    </select>
                </label>
                {/* {
                    <label>
                        <p>Lotes</p>
                        <select onChange={handleLote} >
                            <option value={undefined}>{ }</option>
                            {lotes && lotes.map(lote => (
                                <option key={lote._id} value={lote._id}>
                                    {lote.documento.enf + " - " + lote.documento.predio.PREDIO}
                                </option>
                            ))}
                        </select>
                    </label>
                } */}
            </div>
            <div className="proces-listaempaque-opciones-botones">
                <button className="defaulButtonError" onClick={handleCerrarContenedor} >
                    Cerrar Contenedor
                </button>
                <button className="defaulButtonAgree" onClick={handleShowResumen}>
                    {showResumen ? "Lista de empaque" : "Resumen"}
                </button>
                <button className="defaulButtonAgree" onClick={handleShowPredios}>
                    {showPredios ? "Lista de empaque" : "Predios"}
                </button>
            </div>
        </div>
    )
}
