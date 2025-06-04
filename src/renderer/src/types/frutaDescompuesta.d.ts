/* eslint-disable prettier/prettier */

export type RegistroFrutaDescompuestaType = {
    _id: string;
    kilos: number;
    user: string;
    razon: string;
    comentario_adicional: string;
    tipoFruta: string;
    createdAt: string;
        descarteLavado:{
        descarteGeneral:number
        pareja:number
        balin:number
    }
    descarteEncerado:{
        descarteGeneral:number
        pareja:number
        balin:number
        extra:number
        suelo:number
        frutaNacional:number
    }
}