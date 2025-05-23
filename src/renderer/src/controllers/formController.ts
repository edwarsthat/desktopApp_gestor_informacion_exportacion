/* eslint-disable prettier/prettier */

import React from "react";


export const handleChangeForm = <T>(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    setFormState: React.Dispatch<React.SetStateAction<T>>
): void => {
    const { name, value, type } = event.target;
    const parsedValue = type === "number" ? Number(value) : value;

    setFormState((prev) => ({
        ...prev,
        [name]: parsedValue,
    }));
};