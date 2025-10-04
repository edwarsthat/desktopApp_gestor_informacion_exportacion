/* eslint-disable prettier/prettier */

type PrecintoArrayInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  label?: string;
};

export default function PrecintoArrayInput({ 
  value, 
  onChange, 
  error, 
  label = 'Precintos' 
}: PrecintoArrayInputProps): JSX.Element {
  
  const handleAddPrecinto = (): void => {
    onChange([...value, '']);
  };

  const handleRemovePrecinto = (index: number): void => {
    const newPrecintos = value.filter((_, i) => i !== index);
    // Asegurar que siempre haya al menos un campo
    onChange(newPrecintos.length === 0 ? [''] : newPrecintos);
  };

  const handleChangePrecinto = (index: number, newValue: string): void => {
    const newPrecintos = [...value];
    newPrecintos[index] = newValue;
    onChange(newPrecintos);
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {value.map((precinto, index) => (
          <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              className="form-input"
              value={precinto}
              onChange={(e): void => handleChangePrecinto(index, e.target.value)}
              placeholder={`Precinto ${index + 1}`}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={(): void => handleRemovePrecinto(index)}
              className="default-button-error"
              disabled={value.length === 1}
              style={{ 
                padding: '8px 12px', 
                minWidth: 'auto',
                fontSize: '14px'
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAddPrecinto}
        className="default-button-agree"
        style={{ 
          marginTop: '8px',
          padding: '6px 12px',
          fontSize: '14px'
        }}
      >
        + Agregar Precinto
      </button>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
