/* eslint-disable prettier/prettier */


import React from "react"

type FormInputProps = {
    name: string
    label: string
    type?: string
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string
    placeholder?: string
    disabled?: boolean
}

export default function FormInput({
    name,
    label,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    disabled = false
}: FormInputProps): JSX.Element {

    const formatValueForDateInput = (value: string): string => {
        if (!value) {
            return "";
        }
        try {
            const date = new Date(value);

            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        } catch (e) {
            console.error("Invalid date value provided:", value, e);
        }

        return "";
    };

    return (
        <div className="form-group">
            <label htmlFor={name} className="form-label">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={type === "date" ?  formatValueForDateInput(value as string): value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`form-input ${error ? "input-error" : ""}`}
            />
            {error && <p className="form-error">{error}</p>}
        </div>
    )
}
