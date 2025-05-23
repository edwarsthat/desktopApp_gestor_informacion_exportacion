/* eslint-disable prettier/prettier */


type cantidadCanastillasType = {
    propias: number
    prestadas: [
        {
            cantidad: number
            propietario: string
        }
    ]
}

export type canastillasRegistrosType = {
    _id: string
    fecha_envio: string
    fecha_recibido: string
    fecha_devolucion: string
    fecha_recepcionDevolucion: string
    createdAt: string
    destino: string,
    origen: string,
    cantidad: cantidadCanastillasType,
    observaciones: string,
    usuario: {
        id: string,
        user: string,
    },
    referencia: string,
    tipoMovimiento: string,
    estado: string,
    remitente: string,
    destinatario: string,
    motivo_devolucion: string,
    motivo_retiro_inventario: string
}
