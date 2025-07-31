/* eslint-disable prettier/prettier */

type FormMultipleSelectProps = {
    name: string
    label: string
    value: string[]
    onChange: (e: { target: { name: string, value: string[] } }) => void
    error?: string
    disabled?: boolean
    data: {_id: string, name: string}[]
}

export default function FormMultipleSelect({
    name,
    label,
    value = [],
    onChange,
    error,
    disabled = false,
    data = []
}: FormMultipleSelectProps): JSX.Element {

    const handleCheckboxChange = (itemId: string): void => {
        let newValue: string[];
        
        if (value.includes(itemId)) {
            // Si ya está seleccionado, lo removemos
            newValue = value.filter(id => id !== itemId);
        } else {
            // Si no está seleccionado, lo agregamos
            newValue = [...value, itemId];
        }
        
        // Llamamos onChange con el formato esperado
        onChange({
            target: {
                name,
                value: newValue
            }
        });
    };

    return (
        <div className="form-group">
            <label className="form-label">
                {label}
            </label>
            <div className={`form-multiple-select ${error ? "input-error" : ""}`}>
                {data.map(item => {
                    const isSelected = value.includes(item._id);
                    return (
                        <div 
                            key={item._id} 
                            className={`checkbox-item ${isSelected ? 'selected' : ''}`}
                            onClick={(): void => {
                                if (!disabled) {
                                    handleCheckboxChange(item._id);
                                }
                            }}
                        >
                            <input
                                type="checkbox"
                                id={`${name}_${item._id}`}
                                checked={isSelected}
                                onChange={(): void => {}} // Manejamos el click en el div
                                disabled={disabled}
                                className="checkbox-input"
                            />
                            <span className="checkbox-label">
                                {item.name}
                            </span>
                        </div>
                    );
                })}
            </div>
            {error && <p className="form-error">{error}</p>}
        </div>
    )
}
