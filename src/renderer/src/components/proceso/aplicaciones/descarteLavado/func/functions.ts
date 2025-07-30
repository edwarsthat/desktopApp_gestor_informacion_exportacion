/* eslint-disable prettier/prettier */
import { tiposFrutasType } from '@renderer/types/tiposFrutas';
import { FormState, datosPredioType } from '../types/types';

export const formInit: FormState = {
    descarteGeneral: {
        canastillas: '',
        kilos: '',
    },
    pareja: {
        canastillas: '',
        kilos: '',
    },
    balin: {
        canastillas: '',
        kilos: '',
    },
    descompuesta: {
        canastillas: '',
        kilos: '',
    },
    piel: {
        canastillas: '',
        kilos: '',
    },
    hojas: {
        canastillas: '',
        kilos: '',
    },
};

export const labels = {
    descarteGeneral: 'Descarte General',
    pareja: 'Pareja',
    balin: 'Balin',
    descompuesta: 'Descompuesta',
    piel: 'Desprendimiento de piel',
    hojas: 'Hojas',
};

export const sumarDatos = (datos: FormState, lote: datosPredioType, tiposFruta2: tiposFrutasType[]): object => {
    let mult;
    const tipoFruta = tiposFruta2.find(item => item.tipoFruta === lote.tipoFruta);
    if (tipoFruta) {
        mult = tipoFruta.valorPromedio;
    } else {
        mult = 1;
    }
    const salida = {
        descarteGeneral: 0,
        pareja: 0,
        balin: 0,
        descompuesta: 0,
        piel: 0,
        hojas: 0,
    };
    
    Object.keys(datos).forEach(item => {
        salida[item] = (Number(datos[item].canastillas) * mult) + Number(datos[item].kilos);
    });
    return salida;
};