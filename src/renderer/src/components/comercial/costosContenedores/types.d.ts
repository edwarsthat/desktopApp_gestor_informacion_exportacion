/* eslint-disable prettier/prettier */

export type costoContenedorData = {
    _id: string,
    nombre: string,
    tipoFruta: string,
    [calidad: string]: {
        precio: number,
        kilos: number
    }
}