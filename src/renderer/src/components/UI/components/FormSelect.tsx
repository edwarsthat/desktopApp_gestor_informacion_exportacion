/* eslint-disable prettier/prettier */

type FormInputProps = {
    name: string
    label: string
    value: string | number
    onChange: (e) => void
    error?: string
    disabled?: boolean
    data: {_id:string, name:string}[]
}

export default function FormSelect({
    name,
    label,
    value,
    onChange,
    error,
    disabled = false,
    data = []
}: FormInputProps): JSX.Element {
    return (
        <div className="form-group">
            <label htmlFor={name} className="form-label">
                {label}
            </label>
            <select 
                name={name} 
                id={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`form-input ${error ? "input-error" : ""}`}
            >
                <option value=""></option>
                {data.map(item => (
                    <option value={item._id} key={item._id}>{item.name}</option>
                ))}
                </select>
            {error && <p className="form-error">{error}</p>}
        </div>
    )
}
