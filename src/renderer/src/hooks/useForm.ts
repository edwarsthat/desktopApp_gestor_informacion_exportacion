/* eslint-disable prettier/prettier */

import { useState } from "react"
import { ZodSchema, ZodError } from "zod"

type OutType<T> = {
    formState: T
    formErrors: Partial<Record<keyof T | string, string>>
    handleChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void
    handleArrayChange: (e: { target: { name: string; value: string[] } }) => void
    resetForm: () => void
    fillForm: (formData) => void
    validateForm: (schema: ZodSchema<unknown>) => boolean
    setFormState: (e) => void
}

export default function useForm<T extends Record<string, number | string | string[]>>(initialState?: T): OutType<T> {
    const [formState, setFormState] = useState<T>(initialState ?? ({} as T))
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof T | string, string>>>({})

    const resetForm = (): void => {
        setFormState(initialState ?? {} as T)
    }

    const fillForm = (formData): void => {
        setFormState(formData)
    }

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void => {
        const { name, value, type } = event.target
        const parsedValue = type === "number" ? Number(value) : value

        setFormState(prev => ({
            ...prev,
            [name]: parsedValue,
        }))
    }

    // Función de cambio para campos array
    const handleArrayChange = (e: { target: { name: string; value: string[] } }): void => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getErrorMessages = (zodError: ZodError): Partial<Record<keyof T | string, string>> => {
        const errors: Partial<Record<keyof T | string, string>> = {}
        zodError.errors.forEach(err => {
            const path = err.path[0] as keyof T
            errors[path] = err.message
        })
        return errors
    }

    const validateForm = (schema: ZodSchema<unknown>): boolean => {
        const result = schema.safeParse(formState)
        if (!result.success) {
            const errorMap = getErrorMessages(result.error)
            setFormErrors(errorMap)
            return false
        }
        setFormErrors({})
        return true
    }


    return {
        formState,
        formErrors,
        handleChange,
        resetForm,
        fillForm,
        validateForm,
        setFormState,
        handleArrayChange
    }
}
