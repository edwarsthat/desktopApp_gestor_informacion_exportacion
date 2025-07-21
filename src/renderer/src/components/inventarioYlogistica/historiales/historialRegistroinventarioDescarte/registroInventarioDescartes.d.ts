/* eslint-disable prettier/prettier */

// Mapas recursivos de strings a objetos, terminando en Number
export type KilosDescarte = {
    [tipoFruta: string]: {
        [tipoDescarte: string]: {
            [subtipo: string]: number;
        }
    }
};

export interface InventarioDescarte {
    _id: string;
    fecha: string;
    inventario: KilosDescarte;
    kilos_ingreso: KilosDescarte;
    kilos_salida: KilosDescarte;
}

