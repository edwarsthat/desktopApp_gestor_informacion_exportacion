/* eslint-disable prettier/prettier */

import { contenedoresType } from "../contenedoresType";
import { lotesType } from "../lotesType";
import { calidadesType, tiposFrutasType } from "../tiposFrutas";
import { palletsType } from "./palletsType";


export type itemPalletType = {
    _id: string;
    pallet: palletsType;
    contenedor: contenedoresType;
    lote: lotesType;
    tipoCaja: string;
    calibre: string;
    calidad: calidadesType;
    fecha: string;
    tipoFruta: tiposFrutasType;
    SISPAP: boolean;
    GGN: boolean;
    kilos: number;
    user: string;
    cajas: number;
    __v: number;
}
