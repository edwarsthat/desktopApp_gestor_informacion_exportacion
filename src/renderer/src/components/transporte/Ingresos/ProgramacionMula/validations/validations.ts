/* eslint-disable prettier/prettier */

export type tractomulaFormType = {
    transportadora: string,
    nit: string,
    placa: string,
    trailer: string,
    conductor: string,
    cedula: string,
    celular: string,
    temperatura: string,
    precinto: string,
    datalogger_id: string,
    flete: number,
    marca: string,
    contenedor: string
}

export type camionFormType = {
    placa: string
    conductor: string
    cedula: string
    celular: string
    precinto: string[]
    flete: number
    unidadCarga: string
    pesoEstimado: number
    contenedor: string
}


// Formularios iniciales para cada tipo
export const tractomulaFormInit: tractomulaFormType = {
    transportadora: "",
    nit: "",
    placa: "",
    trailer: "",
    conductor: "",
    cedula: "",
    celular: "",
    temperatura: "",
    precinto: "",
    datalogger_id: "",
    flete: 0,
    marca: "",
    contenedor: ""
}

export const camionFormInit: camionFormType = {
    placa: "",
    conductor: "",
    cedula: "",
    celular: "",
    precinto: [],
    flete: 0,
    unidadCarga: "",
    pesoEstimado: 0,
    contenedor: ""
}

export const labelCamionForm = {
    contenedor: "Contenedor",
    placa: "Placa",
    conductor: "Conductor",
    cedula: "Cédula",
    celular: "Celular",
    precinto: "Precinto",
    flete: "Flete",
    unidadCarga: "Unidad de Carga",
    pesoEstimado: "Peso Estimado",
};

export const labelTractomulaForm = {
    contenedor: "Contenedor",
    transportadora: "Transportadora",
    nit: "NIT",
    placa: "Placa",
    trailer: "Trailer",
    conductor: "Conductor",
    cedula: "Cédula",
    celular: "Celular",
    temperatura: "Temperatura",
    precinto: "Precinto",
    datalogger_id: "Datalogger ID",
    flete: "Flete",
    marca: "Marca",
};  
