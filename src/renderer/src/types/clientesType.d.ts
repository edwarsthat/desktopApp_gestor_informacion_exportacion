/* eslint-disable prettier/prettier */
export type clienteType = {
    _id: string
    CLIENTE: string
    PAIS_DESTINO: string[] 
    CODIGO: number
    CORREO: string
    DIRECCIÓN: string
    ID: string
    TELEFONO: string
    activo: boolean
}

export type clientesNacionalesType = {
    _id: string
    codigo: string,
    cliente: string,
    ubicacion: string,
    canastillas: number,
    createdAt: string
}