/* eslint-disable prettier/prettier */

// FrutaLoader.tsx
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";
import { useEffect } from "react";

export function FrutaLoader(): null {
    const cargarFruta = useTipoFrutaStore((s) => s.cargarFruta);
    const tiposFruta = useTipoFrutaStore((s) => s.tiposFruta);

    useEffect(() => {
        if (!tiposFruta.length) cargarFruta();
    }, [tiposFruta.length, cargarFruta]);

    return null;
}
