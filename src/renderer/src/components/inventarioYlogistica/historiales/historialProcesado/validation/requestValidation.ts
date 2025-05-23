/* eslint-disable prettier/prettier */

import { getErrorMessages } from "@renderer/utils/error";
import { z } from "zod"

export const validateRequestGetData = (data: object): void => {
    try {
        const requestSchema = z.object({
            action: z.literal('get_inventarios_historialProcesado_frutaProcesada'),
            fechaInicio: z.union([
                z.literal(''),
                z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'El formato de fecha debe ser YYYY-MM-DD'),
            ]),
            fechaFin: z.union([
                z.literal(''),
                z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'El formato de fecha debe ser YYYY-MM-DD'),
            ]),
        })
        requestSchema.parse(data)
    } catch (e) {
        if (e instanceof z.ZodError) {
            const errors = getErrorMessages(e);
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }
    }
} 

export const validateRequestModificarRegistro = (data: object): void => {
    try {
        const requestSchema = z.object({
            action: z.literal("put_inventarios_historialProcesado_modificarHistorial"),
            kilosVaciados: z.number().lt(0),
            inventario: z.number().gt(0),
            _id: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "El _id debe ser un ObjectId válido de MongoDB"),
            historialLote: z.object({
                kilosHistorial: z.number({ invalid_type_error: "kilosHistorial debe ser un número" }).lt(0, "el numero debe ser negativo"),
                __vHistorial: z.number().gte(0),
                _idRecord: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "El _id debe ser un ObjectId válido de MongoDB"),
            })
        })
        requestSchema.parse(data)

    } catch (e) {
        if (e instanceof z.ZodError) {
            const errors = getErrorMessages(e);
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }
    }
}