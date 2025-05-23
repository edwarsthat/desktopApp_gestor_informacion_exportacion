/* eslint-disable prettier/prettier */

export type formType = {
    cliente: string
    ubicacion: string
    createdAt: string
    canastillas: number
}

export function validarFormulario(data: formType, clienteSeleccionado: string | undefined): string | null {
    if (!data.cliente?.trim()) {
        throw new Error("El nombre del cliente es obligatorio.")
    }
    if (!data.ubicacion?.trim()) {
        throw new Error("La ubicación es obligatoria.")
    }
    if (!clienteSeleccionado?.trim()) {
        throw new Error("Seleccione un cliente.")
    }
    if (!data.createdAt) {
        throw new Error("La fecha es obligatoria.")
    }
    if (!data.canastillas || data.canastillas <= 0) {
        throw new Error("Las canastillas deben ser mayor a 0.")
    }
    return null
}
