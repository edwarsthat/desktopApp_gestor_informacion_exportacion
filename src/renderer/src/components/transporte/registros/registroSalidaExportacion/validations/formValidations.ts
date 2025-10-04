/* eslint-disable prettier/prettier */

import { z } from "zod";

export const initForm = {
    contenedor: '',
    conductor: '',
    cedula: '',
    celular: '',
    flete: '',
    marca: '',
    datalogger_id: '',
    fecha: '',
    placa: '',
    precinto: [''],
    temperatura: '',
    trailer: '',
    transportadora: '',
    nit: '',
}

export type formType = typeof initForm;

export const labelForms = {
    contenedor: 'Contenedor',
    conductor: 'Conductor',
    cedula: 'Cédula',
    celular: 'Celular',
    flete: 'Flete',
    marca: 'Marca',
    datalogger_id: 'Datalogger ID',
    fecha: 'Fecha',
    placa: 'Placa',
    precinto: 'Precinto',
    temperatura: 'Temperatura',
    trailer: 'Trailer',
    transportadora: 'Transportadora',
    nit: 'NIT',
}

// Regex para validación
const safeStringRegex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ.,\-_]*$/;
const safeAlphanumericRegex = /^[a-zA-Z0-9\-_]*$/;
const numericOnlyRegex = /^\d*$/;
const numericWithDecimalRegex = /^\d*\.?\d*$/;

export const formSchema = z.object({
    contenedor: z.string()
        .min(1, { message: "El contenedor es obligatorio" })
        .regex(safeAlphanumericRegex, { message: "Contenedor contiene caracteres no permitidos" })
        .max(50, { message: "Contenedor demasiado largo" }),
    placa: z.string()
        .min(1, { message: "La placa es obligatoria" })
        .regex(safeAlphanumericRegex, { message: "Placa contiene caracteres no permitidos" })
        .max(15, { message: "Placa demasiado largo" }),
    conductor: z.string()
        .min(1, { message: "El nombre del conductor es obligatorio" })
        .regex(safeStringRegex, { message: "Nombre del conductor contiene caracteres no permitidos" })
        .max(100, { message: "Nombre del conductor demasiado largo" }),
    cedula: z.string()
        .min(1, { message: "La cédula es obligatoria" })
        .regex(numericOnlyRegex, { message: "La cédula debe contener solo números" })
        .max(15, { message: "Cédula demasiado largo" }),
    celular: z.string()
        .min(1, { message: "El celular es obligatorio" })
        .regex(numericOnlyRegex, { message: "El celular debe contener solo números" })
        .max(15, { message: "Celular demasiado largo" }),
    precinto: z.array(
        z.string()
            .min(1, { message: "El precinto no puede estar vacío" })
            .regex(safeAlphanumericRegex, { message: "Precinto contiene caracteres no permitidos" })
            .max(50, { message: "Precinto demasiado largo" })
    ).min(1, { message: "Debe ingresar al menos un precinto" }),
    flete: z.string()
        .min(1, { message: "El flete es obligatorio" })
        .regex(numericWithDecimalRegex, { message: "El flete debe contener solo números" })
        .max(15, { message: "Flete demasiado largo" }),
    
    // Campos opcionales (solo para tractomula)
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
    trailer: z.string()
        .regex(safeAlphanumericRegex, { message: "Trailer contiene caracteres no permitidos" })
        .max(15, { message: "Trailer demasiado largo" })
        .optional()
        .or(z.literal("")),
    temperatura: z.string()
        .regex(/^-?\d*\.?\d*$/, { message: "Temperatura debe ser un número válido" })
        .max(10, { message: "Temperatura demasiado largo" })
        .optional()
        .or(z.literal("")),
    datalogger_id: z.string()
        .regex(safeAlphanumericRegex, { message: "Datalogger ID contiene caracteres no permitidos" })
        .max(50, { message: "Datalogger ID demasiado largo" })
        .optional()
        .or(z.literal("")),
    marca: z.string()
        .regex(safeStringRegex, { message: "Marca contiene caracteres no permitidos" })
        .max(50, { message: "Marca demasiado largo" })
        .optional()
        .or(z.literal("")),
    fecha: z.string()
        .optional()
        .or(z.literal("")),
})