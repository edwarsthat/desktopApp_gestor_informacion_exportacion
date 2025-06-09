/* eslint-disable prettier/prettier */
import { z } from "zod";

export type formTypeOutput = z.infer<typeof formSchema> // lo que ya procesaste
export type formTypeInput = z.input<typeof formSchema>

export const initialForm = {
    canastillas: "",
    _id: "",
}

export const formSchema = z.object({
    canastillas: z.coerce.number({
        invalid_type_error: "Debe ser un número",
    }).int("No se permiten decimales").min(1, "Debe ser mayor o igual a 1"),
    _id: z.string().min(1, "El cuarto desverdizado es obligatorio"),
})

export type formType = {
    canastillas: string;
    _id: string;
}