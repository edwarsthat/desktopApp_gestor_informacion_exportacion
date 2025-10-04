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
    tipoSalida: string
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
    contenedor: "",
    tipoSalida: ""
}
export const labelCamionForm = {
    tipoSalida: "Tipo de Salida",
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

// Regex para prevenir inyecciones NoSQL y caracteres peligrosos
// Permite letras, números, espacios, guiones, puntos y caracteres comunes
const safeStringRegex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ.,\-_]*$/;
const safeAlphanumericRegex = /^[a-zA-Z0-9\-_]*$/;
const numericOnlyRegex = /^\d*$/;
const numericWithDecimalRegex = /^\d*\.?\d*$/;

// Función de sanitización adicional exportada para uso en el backend
export const sanitizeString = (str: string): string => {
    return str
        .replace(/\$/g, '') // Eliminar $ (operadores MongoDB)
        .replace(/\{|\}/g, '') // Eliminar llaves
        .replace(/\[|\]/g, '') // Eliminar corchetes
        .replace(/<|>/g, '') // Eliminar < >
        .replace(/;/g, ''); // Eliminar punto y coma
};

export const schemaTractomula = z.object({
    transportadora: z.string()
        .regex(safeStringRegex, { message: "Transportadora contiene caracteres no permitidos" })
        .max(100, { message: "Transportadora demasiado largo" })
        .optional()
        .or(z.literal("")),
    nit: z.string()
        .regex(numericOnlyRegex, { message: "NIT debe contener solo números" })
        .max(20, { message: "NIT demasiado largo" })
        .optional()
        .or(z.literal("")),
    placa: z.string()
        .regex(safeAlphanumericRegex, { message: "Placa contiene caracteres no permitidos" })
        .max(15, { message: "Placa demasiado largo" })
        .optional()
        .or(z.literal("")),
    trailer: z.string()
        .regex(safeAlphanumericRegex, { message: "Trailer contiene caracteres no permitidos" })
        .max(15, { message: "Trailer demasiado largo" })
        .optional()
        .or(z.literal("")),
    conductor: z.string()
        .regex(safeStringRegex, { message: "Nombre del conductor contiene caracteres no permitidos" })
        .max(100, { message: "Nombre del conductor demasiado largo" })
        .optional()
        .or(z.literal("")),
    cedula: z.string()
        .regex(numericOnlyRegex, { message: "La cédula debe contener solo números" })
        .max(15, { message: "Cédula demasiado largo" })
        .optional()
        .or(z.literal("")),
    celular: z.string()
        .regex(numericOnlyRegex, { message: "El celular debe contener solo números" })
        .max(15, { message: "Celular demasiado largo" })
        .optional()
        .or(z.literal("")),
    temperatura: z.string()
        .regex(/^-?\d*\.?\d*$/, { message: "Temperatura debe ser un número válido" })
        .max(10, { message: "Temperatura demasiado largo" })
        .optional()
        .or(z.literal("")),
    precinto: z.string()
        .regex(safeAlphanumericRegex, { message: "Precinto contiene caracteres no permitidos" })
        .max(50, { message: "Precinto demasiado largo" })
        .optional()
        .or(z.literal("")),
    datalogger_id: z.string()
        .regex(safeAlphanumericRegex, { message: "Datalogger ID contiene caracteres no permitidos" })
        .max(50, { message: "Datalogger ID demasiado largo" })
        .optional()
        .or(z.literal("")),
    flete: z.string()
        .regex(numericWithDecimalRegex, { message: "El flete debe contener solo números" })
        .max(15, { message: "Flete demasiado largo" })
        .optional()
        .or(z.literal("")),
    marca: z.string()
        .regex(safeStringRegex, { message: "Marca contiene caracteres no permitidos" })
        .max(50, { message: "Marca demasiado largo" })
        .optional()
        .or(z.literal("")),
    contenedor: z.string()
        .regex(safeAlphanumericRegex, { message: "Contenedor contiene caracteres no permitidos" })
        .max(50, { message: "Contenedor demasiado largo" })
        .optional()
        .or(z.literal("")),
});

export const schemaCamion = z.object({
    placa: z.string()
        .regex(safeAlphanumericRegex, { message: "Placa contiene caracteres no permitidos" })
        .max(15, { message: "Placa demasiado largo" })
        .optional()
        .or(z.literal("")),
    conductor: z.string()
        .regex(safeStringRegex, { message: "Nombre del conductor contiene caracteres no permitidos" })
        .max(100, { message: "Nombre del conductor demasiado largo" })
        .optional()
        .or(z.literal("")),
    cedula: z.string()
        .regex(numericOnlyRegex, { message: "La cédula debe contener solo números" })
        .max(15, { message: "Cédula demasiado largo" })
        .optional()
        .or(z.literal("")),
    celular: z.string()
        .regex(numericOnlyRegex, { message: "El celular debe contener solo números" })
        .max(15, { message: "Celular demasiado largo" })
        .optional()
        .or(z.literal("")),
    precinto: z.array(
        z.string()
            .regex(safeAlphanumericRegex, { message: "Precinto contiene caracteres no permitidos" })
            .max(50, { message: "Precinto demasiado largo" })
    ).optional(),
    flete: z.string()
        .regex(numericWithDecimalRegex, { message: "El flete debe contener solo números" })
        .max(15, { message: "Flete demasiado largo" })
        .optional()
        .or(z.literal("")),
    unidadCarga: z.string()
        .regex(safeStringRegex, { message: "Unidad de Carga contiene caracteres no permitidos" })
        .max(50, { message: "Unidad de Carga demasiado largo" })
        .optional()
        .or(z.literal("")),
    pesoEstimado: z.string()
        .regex(numericWithDecimalRegex, { message: "El flete debe contener solo números" })
        .max(15, { message: "Flete demasiado largo" })
        .optional()
        .or(z.literal("")),
    contenedor: z.string()
        .regex(safeAlphanumericRegex, { message: "Contenedor contiene caracteres no permitidos" })
        .max(50, { message: "Contenedor demasiado largo" })
        .optional()
        .or(z.literal("")),
    tipoSalida: z.enum(["Nacional", "Exportacion"], {
        required_error: "Debe seleccionar el tipo de salida",
        invalid_type_error: "Debe seleccionar Nacional o Exportación"
    }),
});
