/* eslint-disable prettier/prettier */

import { useState } from "react"

type outType = {
    fechaInicio: string
    setFechaInicio: (e: string) => void
    fechaFin: string
    setFechaFin: (e: string) => void
    tipoFruta: string
    setTipoFruta: (e) => void
    GGN: boolean
    setGGN: (e: boolean) => void
    buscar:string
    setBuscar: (e:string) => void
    proveedor: string
    setProveedor: (e:string) => void
    tipoFecha: string
    setTipoFecha: (e:string) => void
    EF: string
    setEF: (e:string) => void
    all: boolean
    setAll: (e:boolean) =>  void
}

export type FilterValues = {
    tipoFruta: string;
    fechaInicio: string;
    fechaFin: string;
    GGN: boolean;
    buscar: string;
    proveedor: string;
    tipoFecha: string;
    EF: string
    all: boolean
};

export function useFiltro(): outType {
    const [fechaInicio, setFechaInicio] = useState<string>('')
    const [fechaFin, setFechaFin] = useState<string>('')
    const [tipoFruta, setTipoFruta] = useState<string>('')
    const [GGN, setGGN] = useState<boolean>(false)
    const [buscar, setBuscar] = useState<string>('')
    const [proveedor, setProveedor] = useState<string>('')
    const [tipoFecha, setTipoFecha] = useState<string>('')
    const [EF, setEF] = useState<string>('')
    const [all, setAll] = useState<boolean>(false)

    return {
        fechaInicio,
        setFechaInicio,
        fechaFin,
        setFechaFin,
        tipoFruta,
        setTipoFruta,
        GGN,
        setGGN,
        buscar,
        setBuscar,
        proveedor,
        setProveedor,
        tipoFecha,
        setTipoFecha,
        EF,
        setEF,
        all,
        setAll
    }
}

type currentValuestype = {
    currentFilters: FilterValues
    setCurrentFilters: (e) => void
}

export function useFiltroValue(): currentValuestype {
    const [currentFilters, setCurrentFilters] = useState<FilterValues>({
        tipoFruta: '',
        fechaInicio: '',
        fechaFin: '',
        GGN: false,
        buscar: '',
        proveedor: '',
        tipoFecha:'',
        EF: '',
        all: false,
    });
    return {
        currentFilters,
        setCurrentFilters
    }
}