/* eslint-disable prettier/prettier */
import { contenedoresType } from '@renderer/types/contenedoresType';
import { historialLotesType } from '@renderer/types/lotesType';
import { create } from 'zustand'

type listaEmpaqueStore = {
    contenedor: contenedoresType | null;
    setContenedor: (data: contenedoresType) => void;
    lote: historialLotesType | null;
    setLote: (data: historialLotesType) => void;
};


const useListaEmpaqueStore = create<listaEmpaqueStore>((set) => ({
    contenedor: null,
    setContenedor: (data: contenedoresType): void => set({ contenedor: data }),
    lote: null,
    setLote: (data: historialLotesType): void => set({ lote: data }),
}))

export default useListaEmpaqueStore