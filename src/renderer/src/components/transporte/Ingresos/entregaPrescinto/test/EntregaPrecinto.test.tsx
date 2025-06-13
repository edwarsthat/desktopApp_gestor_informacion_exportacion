/* eslint-disable prettier/prettier */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import EntregaPrescinto from '../EntregaPrescinto';

// Mock de useAppContext para evitar el error "Error informes context data global"
vi.mock('@renderer/hooks/useAppContext', () => ({
    default: () => ({
        messageModal: vi.fn(),
        setLoading: vi.fn(),
        loading: false,
    })
}));

// Mock de useForm para controlar el estado del formulario
const mockHandleChange = vi.fn();
vi.mock('@renderer/hooks/useForm', () => ({
    default: () => ({
        formState: {
            _id: "",
            entrega: "",
            recibe: "",
            fechaEntrega: "",
            observaciones: "",
        },
        formErrors: {},
        handleChange: mockHandleChange,
        validateForm: vi.fn(),
        resetForm: vi.fn(),
    })
}));

// Mock de window.api.server2 para que devuelva la data de contenedores esperada
Object.defineProperty(window, 'api', {
    value: {
        server2: vi.fn().mockResolvedValue({
            status: 200,
            data: [
                {
                    _id: 'abc',
                    numeroContenedor: '123',
                    infoContenedor: {
                        clienteInfo: {
                            CLIENTE: 'Contenedor A'
                        }
                    }
                },
                {
                    _id: 'def',
                    numeroContenedor: '456',
                    infoContenedor: {
                        clienteInfo: {
                            CLIENTE: 'Contenedor B'
                        }
                    }
                }
            ]
        })
    }
});

describe('EntregaPrescinto', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('debería renderizarse correctamente', () => {
        render(<EntregaPrescinto />);
        expect(screen.getByText('Entrega precinto')).toBeInTheDocument();
    });

    it('muestra opciones de FormSelect y permite seleccionarlas', async () => {
        render(<EntregaPrescinto />);

        // Espera a que se carguen las opciones (ya que es async)
        await waitFor(() => {
            // Deben aparecer las opciones formateadas
            expect(screen.getByText('123 - Contenedor A')).toBeInTheDocument();
            expect(screen.getByText('456 - Contenedor B')).toBeInTheDocument();
        });

        // Simula seleccionar una opción
        const select = screen.getByLabelText(/Contenedores/i);
        fireEvent.change(select, { target: { value: 'def', name: '_id' } });

        // El valor del select debe ser 'def'
        expect(select.value).toBe('def');

        // Opcional: verifica que el handleChange se llamó (por integración)
        expect(mockHandleChange).toHaveBeenCalled();
        // Si quieres, inspecciona el evento recibido
        const event = mockHandleChange.mock.calls[0][0];
        expect(event.target.value).toBe('def');
    });
});
