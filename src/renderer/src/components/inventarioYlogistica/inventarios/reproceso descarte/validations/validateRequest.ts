/* eslint-disable prettier/prettier */
import { getErrorMessages } from "@renderer/utils/error";
import { z } from "zod"

// Definir el patrón regex para las llaves válidas
const validKeyRegex = /^(descarteEncerado|descarteLavado|frutaNacional).*$/;

export const validateRequestObjRequestDescarte = (data: object): void => {

    // Definir el schema para el objeto dinámico
    const objRequestDescarteSchema = z.record(
        // Schema para la llave: debe ser un string que cumpla el regex
        z.string().regex(validKeyRegex, "La llave debe empezar con 'descarteEncerado', 'descarteLavado' o 'frutaNacional'."),
    );
    try {
        objRequestDescarteSchema.parse(data);
    } catch (e) {
        if (e instanceof z.ZodError) {
            const errors = getErrorMessages(e);
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }
    }
}

export const validateReprocesarPredioRequest = (data: object): void => {

    try {
        const reprocesarPredioSchema = z.object({
            _id: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "El _id debe ser un ObjectId válido de MongoDB"),
            query: z.record(
                z.string().regex(validKeyRegex, "La llave debe empezar con 'descarteEncerado', 'descarteLavado' o 'frutaNacional'."), // Schema para la LLAVE
                z.number() 
            ),
            inventario: z.object({
                descarteEncerado: z.object({
                    balin: z.number().lte(0).optional(),
                    descarteGeneral: z.number().lte(0).optional(),
                    extra: z.number().lte(0).optional(),
                    frutaNacional: z.number().lte(0).optional(),
                    pareja: z.number().lte(0).optional(),
                    suelo: z.number().lte(0).optional(),
                }).refine(data => data.balin !== undefined || data.descarteGeneral !== undefined || data.extra !== undefined || data.frutaNacional !== undefined || data.pareja !== undefined || data.suelo !== undefined, "El objeto 'inventario' debe contener al menos 'balin', 'descarteGeneral', 'extra', 'frutaNacional', 'pareja' o 'suelo'."),
                descarteLavado: z.object({
                    balin: z.number().lte(0).optional(),
                    descarteGeneral: z.number().lte(0).optional(),
                    pareja: z.number().lte(0).optional(),
                }).refine(data => data.balin !== undefined || data.descarteGeneral !== undefined || data.pareja !== undefined, "El objeto 'inventario' debe contener al menos 'balin', 'descarteGeneral' o 'pareja'."),
            }).refine(data => data.descarteEncerado !== undefined || data.descarteLavado !== undefined, "El objeto 'inventario' debe contener al menos 'descarteEncerado' o 'descarteLavado'."),

        })

        reprocesarPredioSchema.parse(data);
    } catch (e) {
        if (e instanceof z.ZodError) {
            const errors = getErrorMessages(e);
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }
    }
}

