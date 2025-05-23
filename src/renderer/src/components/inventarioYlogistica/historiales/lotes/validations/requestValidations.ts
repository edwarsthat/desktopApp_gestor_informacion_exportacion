/* eslint-disable prettier/prettier */

import { getErrorMessages } from "@renderer/utils/error";
import { z } from "zod"

export const validateRequestLotes = (data: object): void => {
    try {
        const requestSchema = z.object({
            EF: z.string(),
            GGN: z.boolean(),
            action: z.literal("get_inventarios_lotes_infoLotes"),
            buscar: z.string(),
            fechaFin: z.union([
                z.literal(''),
                z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'El formato de fecha debe ser YYYY-MM-DD'),
            ]),
            fechaInicio: z.union([
                z.literal(''),
                z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'El formato de fecha debe ser YYYY-MM-DD'),
            ]),
            proveedor: z.string(),
            tipoFecha: z.string(),
            tipoFruta: z.string(),
            all: z.boolean(),
        })
        requestSchema.parse(data)
    } catch (e) {
        if (e instanceof z.ZodError) {
            const errors = getErrorMessages(e);
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }
    }
}
