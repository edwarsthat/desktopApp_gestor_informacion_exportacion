/* eslint-disable prettier/prettier */
import { calidadesType, tiposFrutasType } from '@renderer/types/tiposFrutas';
import { create } from 'zustand'

type FrutaStore = {
    tiposFruta: tiposFrutasType[];
    tiposCalidades: calidadesType[]
    isLoading: boolean;
    error: string | null;
    cargarFruta: () => Promise<void>;
};


const useTipoFrutaStore = create<FrutaStore>((set) => ({
    tiposFruta: [],
    tiposCalidades: [],
    isLoading: false,
    error: null,

    cargarFruta: async (): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
            const request = {
                action: "get_data_tipoFruta2"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error('Error al cargar los tipos de fruta');
            }

            set({ tiposFruta: response.data, tiposCalidades: response.data.flatMap(item => item.calidades), isLoading: false });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
        }
    }
}))

export default useTipoFrutaStore