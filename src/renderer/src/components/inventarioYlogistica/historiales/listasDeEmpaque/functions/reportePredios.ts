/* eslint-disable prettier/prettier */

import { itemPalletType } from "@renderer/types/contenedores/itemsPallet";

export type resumenPredioType = {
    [key: string]: {
        predio: string
        ICA: string,
        cajas: number;
        peso: number;
        pesoBruto: number;
        SISPAP: boolean;
    }
}

export const resumenPredios = (items: itemPalletType[]): [resumenPredioType, totalCajas: number, pesoTotal: number] => {
    const out: resumenPredioType = {};
    let totalCajas = 0;
    let pesoTotal = 0;
    for (const item of items) {
        const id = item.lote?.predio._id || "SIN PREDIO";
        const predio = item.lote?.predio.PREDIO || "SIN PREDIO";
        const ICA = item.lote?.predio.ICA.code || "SIN SIPAP";
        if (predio && ICA && id) {
            if (!out[id]) {
                out[id] = {
                    predio: predio,
                    cajas: 0,
                    peso: 0,
                    pesoBruto: 0,
                    ICA: ICA,
                    SISPAP: false
                };
            }
            out[id].cajas += item.cajas
            out[id].peso += item.kilos
            out[id].SISPAP = item.SISPAP || false

        }
        totalCajas += item.cajas
        pesoTotal += item.kilos
    };

    return [out, totalCajas, pesoTotal];
};
