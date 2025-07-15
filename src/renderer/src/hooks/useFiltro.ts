/* eslint-disable prettier/prettier */

import { tiposFrutasType } from "@renderer/types/tiposFrutas"
import { useState } from "react"

const initCurrentFilter = {
        tipoFruta: '',
        tipoFruta2: {} as tiposFrutasType,
        fechaInicio: '',
        fechaFin: '',
        GGN: false,
        buscar: '',
        proveedor: '',
        tipoFecha:'',
        divisionTiempo: "",
        EF: '',
        all: false,
        cuartoDesverdizado: ''
}

type outType = {
    fechaInicio: string
    setFechaInicio: (e: string) => void
    fechaFin: string
    setFechaFin: (e: string) => void
    tipoFruta: string
    setTipoFruta: (e) => void
    tipoFruta2: tiposFrutasType
    setTipoFruta2: (e) => void
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
    cuartoDesverdizado: string
    setCuartoDesverdizado: (e:string) => void
    divisionTiempo: string
    setDivisionTiempo: (e:string) => void
    all: boolean
    setAll: (e:boolean) =>  void
}

export type FilterValues = {
    tipoFruta: string;
    tipoFruta2: tiposFrutasType;
    fechaInicio: string;
    fechaFin: string;
    GGN: boolean;
    buscar: string;
    proveedor: string;
    tipoFecha: string;
    cuartoDesverdizado: string;
    divisionTiempo: string;
    EF: string;
    all: boolean
};

export function useFiltro(): outType {
    const [fechaInicio, setFechaInicio] = useState<string>('')
    const [fechaFin, setFechaFin] = useState<string>('')
    const [tipoFruta, setTipoFruta] = useState<string>('')
    const [tipoFruta2, setTipoFruta2] = useState<tiposFrutasType>({} as tiposFrutasType)
    const [GGN, setGGN] = useState<boolean>(false)
    const [buscar, setBuscar] = useState<string>('')
    const [proveedor, setProveedor] = useState<string>('')
    const [tipoFecha, setTipoFecha] = useState<string>('')
    const [EF, setEF] = useState<string>('')
    const [cuartoDesverdizado, setCuartoDesverdizado] = useState<string>('')
    const [divisionTiempo, setDivisionTiempo] = useState<string>('')
    const [all, setAll] = useState<boolean>(false)
   

    return {
        fechaInicio,
        setFechaInicio,
        fechaFin,
        setFechaFin,
        tipoFruta,
        setTipoFruta,
        tipoFruta2,
        setTipoFruta2,
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
        setAll,
        cuartoDesverdizado,
        setCuartoDesverdizado,
        divisionTiempo,
        setDivisionTiempo
    }
}

type currentValuestype = {
    currentFilters: FilterValues
    setCurrentFilters: (e) => void
    resetCurrentValue: () => void
}

export function useFiltroValue(): currentValuestype {
    const [currentFilters, setCurrentFilters] = useState<FilterValues>(initCurrentFilter);

    const resetCurrentValue = ():void => {
        setCurrentFilters(initCurrentFilter)
    }
    return {
        currentFilters,
        setCurrentFilters,
        resetCurrentValue
    }
}