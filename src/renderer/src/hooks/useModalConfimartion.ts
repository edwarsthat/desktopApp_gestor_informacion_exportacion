/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";

type TypeOut = {
    showConfirmation: boolean;
    setShowConfirmation: (value: boolean) => void;
    message: string;
    setMessage: (value: string) => void;
    setConfirm: (value: boolean) => void;
    requestConfirm: (callback: () => void | Promise<void>, message?: string) => void;
}


export function useConfirm(): TypeOut {
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('¿Seguro desea continuar?')
    const [confirm, setConfirm] = useState<boolean>(false)
    const [callBack, setCallback] = useState<() => void | Promise<void>>(() => console.log('Callback function not set'));

    useEffect(() => {
        if (confirm) {
            callBack();
            setConfirm(false);
        }
    }, [confirm]);

    const requestConfirm = (cb: () => void | Promise<void>, msg = "¿Seguro desea continuar?"):void => {
        setCallback(() => cb);
        setMessage(msg);
        setShowConfirmation(true);
    };

    return {
        showConfirmation,
        setShowConfirmation,
        message,
        setMessage,
        setConfirm,
        requestConfirm
    }
}   
