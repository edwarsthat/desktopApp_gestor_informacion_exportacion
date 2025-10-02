/* eslint-disable prettier/prettier */

import { z } from "zod"

export type tractomulaFormType = {
    transportadora: string,
    nit: string,
    placa: string,
    trailer: string,
    conductor: string,
    cedula: string,
    celular: string,
    temperatura: string,
    precinto: string,
    datalogger_id: string,
    flete: number,
    marca: string,
    contenedor: string
}
export type camionFormType = {
    placa: string
    conductor: string
    cedula: string
    celular: string
    precinto: string[]
    flete: number
    unidadCarga: string
    pesoEstimado: number
    contenedor: string
}
// Formularios iniciales para cada tipo
export const tractomulaFormInit: tractomulaFormType = {
    transportadora: "",
    nit: "",
    placa: "",
    trailer: "",
    conductor: "",
    cedula: "",
    celular: "",
    temperatura: "",
    precinto: "",
    datalogger_id: "",
    flete: 0,
    marca: "",
    contenedor: ""
}
export const camionFormInit: camionFormType = {
    placa: "",
    conductor: "",
    cedula: "",
    celular: "",
    precinto: [],
    flete: 0,
    unidadCarga: "",
    pesoEstimado: 0,
    contenedor: ""
}
export const labelCamionForm = {
    contenedor: "Contenedor",
    placa: "Placa",
    conductor: "Conductor",
    cedula: "Cédula",
    celular: "Celular",
    precinto: "Precinto",
    flete: "Flete",
    unidadCarga: "Unidad de Carga",
    pesoEstimado: "Peso Estimado",
};
export const labelTractomulaForm = {
    contenedor: "Contenedor",
    transportadora: "Transportadora",
    nit: "NIT",
    placa: "Placa",
    trailer: "Trailer",
    conductor: "Conductor",
    cedula: "Cédula",
    celular: "Celular",
    temperatura: "Temperatura",
    precinto: "Precinto",
    datalogger_id: "Datalogger ID",
    flete: "Flete",
    marca: "Marca",
};  
export const schemaTractomula = z.object({
    transportadora: z.string().min(1, { message: "Transportadora es requerida" }),
    nit: z.string().min(1, { message: "NIT es requerido" }),
    placa: z.string().min(1, { message: "Placa es requerida" }),
    trailer: z.string().min(1, { message: "Trailer es requerido" }),
    conductor: z.string().min(1, { message: "Conductor es requerido" }),
    cedula: z.string().min(1, { message: "Cédula es requerida" }),
    celular: z.string().min(1, { message: "Celular es requerido" }),
    temperatura: z.string().min(1, { message: "Temperatura es requerida" }),
    precinto: z.string().min(1, { message: "Precinto es requerido" }),
    datalogger_id: z.string().min(1, { message: "Datalogger ID es requerido" }),
    flete: z.number().min(0, { message: "Flete es requerido" }),
    marca: z.string().min(1, { message: "Marca es requerida" }),
    contenedor: z.string().min(1, { message: "Contenedor es requerido" }),
});
export const schemaCamion = z.object({
    placa: z.string().min(1, { message: "Placa es requerida" }),
    conductor: z.string().min(1, { message: "Conductor es requerido" }),
    cedula: z.string().min(1, { message: "Cédula es requerida" }),
    celular: z.string().min(1, { message: "Celular es requerido" }),
    precinto: z.array(z.string().min(1)).min(1, { message: "Al menos un precinto es requerido" }),
    flete: z.number().min(0, { message: "Flete es requerido" }),
    unidadCarga: z.string().min(1, { message: "Unidad de Carga es requerida" }),
    pesoEstimado: z.number().min(0, { message: "Peso Estimado es requerido" }),
    contenedor: z.string().min(1, { message: "Contenedor es requerido" }),
});
