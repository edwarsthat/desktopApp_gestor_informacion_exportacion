/* eslint-disable prettier/prettier */
import { useState } from "react"
import { descarteType, inventarioDescarteType } from "../types/types"
import { inventarioInit } from "../function/llaves"


type outType = {
    seleccionarVariosItems: (items) => void
    seleccionarItems: (e) => void
    enfObj
    reprocesar: boolean
    handleChange: (name, value, type) => void
    formState: inventarioDescarteType
    setFormState: (e) => void
    uncheckedAll: () => void
}

type propsType = descarteType[]

export default function useModificarDescarte(data: propsType): outType {
    const [enfObj, setEnfObject] = useState({});
    const [reprocesar, setReprocesar] = useState<boolean>(true)
    const [formState, setFormState] = useState<inventarioDescarteType>(inventarioInit);

    const seleccionarVariosItems = (items): void => {
        for (const i of items) {
            const id = i.value
            const [enf, descarte, tipoDescarte] = i.value.split('/')
            const lote = data.find((lote) => enf === lote._id)
            const obj = enfObj

            if (i.checked && lote) {
                setEnfObject(state => {
                    const newState = structuredClone ? structuredClone(state) : JSON.parse(JSON.stringify(state));
                    newState[id] = lote && lote[descarte][tipoDescarte]
                    return newState
                })
                obj[id] = lote && lote[descarte][tipoDescarte]

            } else if (!i.checked && lote) {
                setEnfObject(state => {
                    const newState = structuredClone ? structuredClone(state) : JSON.parse(JSON.stringify(state));
                    delete newState[id]
                    return newState
                })
                delete obj[id]

            }
        }
        isProcesar(enfObj)
    }
    const isProcesar = (data): void => {
        const keys = Object.keys(data)
        const enf = keys.map((item) => item.split('/')[0])
        const setEnfs = new Set(enf)
        const arrayEnf = [...setEnfs]
        if (arrayEnf.length === 1) {
            setReprocesar(true)
        } else {
            setReprocesar(false)
        }
    }
    const seleccionarItems = (e): void => {
        const id = e.target.value
        const [enf, descarte, tipoDescarte] = e.target.value.split('/')
        const lote = data.find((lote) => enf === lote._id)
        const obj = enfObj
        if (e.target.checked && lote) {
            setEnfObject(state => {
                state[id] = lote && lote[descarte][tipoDescarte]
                return { ...state }
            })
            obj[id] = lote && lote[descarte][tipoDescarte]

        } else if (!e.target.checked && lote) {
            setEnfObject(state => {
                delete enfObj[id]
                return { ...state }
            })
            delete obj[id]
        }
        isProcesar(obj)
    }

    const uncheckedAll = (): void => {
        setEnfObject(() => {
            const newstate = structuredClone ? structuredClone({}) : JSON.parse(JSON.stringify({}));
            return newstate
        })
        setReprocesar(true)
        setFormState(inventarioInit)
    }

    const handleChange = (name, value, type): void => {
        setFormState((prevState) => ({
            ...prevState,
            [name]: {
                ...prevState[name],
                [type]: value,
            },
        }));
    };

    

    return {
        seleccionarVariosItems,
        seleccionarItems,
        enfObj,
        reprocesar,
        handleChange,
        formState,
        setFormState,
        uncheckedAll
    }
}
