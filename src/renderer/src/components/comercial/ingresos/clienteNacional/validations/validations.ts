/* eslint-disable prettier/prettier */

export function ValidarDatosClientesNacional(formState): Error | void{
    if (!formState?.cliente?.trim()) {
        throw new Error(`El nombre del cliente no puede estar vacío.`)
    }
    if (!formState?.ubicacion?.trim()) {
        throw new Error(`La ubicación no puede estar vacío.`)
    }
    const regex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s]+$/;
    if (!regex.test(formState.cliente)) {
        throw new Error(`El nombre del cliente solo puede contener letras y números.`)
    }
    if (!regex.test(formState.ubicacion)) {
        throw new Error(`La ubicación solo puede contener letras y números.`)
    }
    return 
}
