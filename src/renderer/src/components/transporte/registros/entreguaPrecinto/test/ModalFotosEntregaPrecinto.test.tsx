/* eslint-disable prettier/prettier */
import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import ModalFotosEntregaPrecinto from '../components/ModalFotosEntregaPrecinto';
import { vehiculosType } from '@renderer/types/salidaTransporte/vehiculos';


// Mock del contexto de la aplicación
const mockSetLoading = vi.fn();
const mockMessageModal = vi.fn();

// Mock del contexto
vi.mock('@renderer/hooks/useAppContext', () => ({
    default: vi.fn(() => ({
        setLoading: mockSetLoading,
        messageModal: mockMessageModal,
    }))
}));

function mockServer2ResponseWithData(mockData: unknown): void {
    Object.defineProperty(window, 'api', {
        value: {
            server2: vi.fn().mockResolvedValue({
                status: 200,
                data: mockData,
            }),
        },
        writable: true
    });
}

// Helper para crear un contenedor mock con la estructura correcta
function createMockVehiculo(overrides: Partial<vehiculosType> = {}): vehiculosType {
    return {
        _id: 'test-id',
        placa: 'ABC-123',
        trailer: 'TRL-456',
        precinto: ['PRECINTO-001'],
        codigo: 'COD-001',
        contenedor: {
            numeroContenedor: '123456',
            infoContenedor: {
                clienteInfo: {
                    CLIENTE: 'Cliente Test'
                }
            }
        },
        entregaPrecinto: {
            entrega: 'Juan Pérez',
            recibe: 'María García',
            fechaEntrega: new Date().toISOString(),
            observaciones: 'Todo en orden',
            fotos: ['foto1.jpg', 'foto2.jpg'],
            createdAt: new Date().toISOString(),
            user: 'usuario-test'
        },
        ...overrides
    } as vehiculosType;
}

describe("Registro modal ver fotos entrega precinto", () => {
    beforeAll(() => {
        // Mock default de window.api.server2 que devuelve un array vacío
        Object.defineProperty(window, 'api', {
            value: {
                server2: vi.fn().mockResolvedValue({
                    status: 200,
                    data: [],
                }),
            },
            writable: true
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });
    it('debería renderizarse correctamente', () => {
        const mockOnClose = vi.fn();
        const mockContenedor = createMockVehiculo();

        render(
            <ModalFotosEntregaPrecinto
                open={true}
                onClose={mockOnClose}
                contenedorSeleccionado={mockContenedor}
            />
        );
        expect(screen.getByText('Fotos de Entrega de Precinto')).toBeInTheDocument();
    });
    it('debería llamar onClose cuando se hace clic en el botón de cerrar', () => {
        const mockOnClose = vi.fn();
        const mockContenedor = createMockVehiculo();
        mockServer2ResponseWithData([]);

        render(
            <ModalFotosEntregaPrecinto
                open={true}
                onClose={mockOnClose}
                contenedorSeleccionado={mockContenedor}
            />
        );

        const closeButton = screen.getByText('×');
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });      
    it('debería tener el atributo open cuando open es true', () => {
        const mockOnClose = vi.fn();
        const mockContenedor = createMockVehiculo();

        render(
            <ModalFotosEntregaPrecinto
                open={true}
                onClose={mockOnClose}
                contenedorSeleccionado={mockContenedor}
            />
        );

        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('open');
    });
    it('debería mostrar mensaje de cargando cuando no hay fotos', () => {
        const mockOnClose = vi.fn();
        const mockContenedor = createMockVehiculo();

        render(
            <ModalFotosEntregaPrecinto
                open={true}
                onClose={mockOnClose}
                contenedorSeleccionado={mockContenedor}
            />
        );

        expect(screen.getByText('Cargando fotos...')).toBeInTheDocument();
    });

    it('debería mostrar error si no hay contenedor seleccionado', () => {
        const mockOnClose = vi.fn();

        render(
            <ModalFotosEntregaPrecinto
                open={true}
                onClose={mockOnClose}
                contenedorSeleccionado={undefined}
            />
        );

        // El modal debería cerrar automáticamente y mostrar error
        expect(mockMessageModal).toHaveBeenCalled();
    });

    it('debería mostrar error si el contenedor no tiene fotos', () => {
        const mockOnClose = vi.fn();
        const mockContenedor = createMockVehiculo({
            entregaPrecinto: {
                entrega: 'Juan Pérez',
                recibe: 'María García',
                fechaEntrega: new Date().toISOString(),
                observaciones: 'Sin fotos',
                fotos: [], // Array vacío
                createdAt: new Date().toISOString(),
                user: 'usuario-test'
            }
        } as Partial<vehiculosType>);

        render(
            <ModalFotosEntregaPrecinto
                open={true}
                onClose={mockOnClose}
                contenedorSeleccionado={mockContenedor}
            />
        );

        // Debería mostrar mensaje de error
        expect(mockMessageModal).toHaveBeenCalled();
    });

    it('debería mostrar el botón cerrar en el footer', () => {
        const mockOnClose = vi.fn();
        const mockContenedor = createMockVehiculo();

        render(
            <ModalFotosEntregaPrecinto
                open={true}
                onClose={mockOnClose}
                contenedorSeleccionado={mockContenedor}
            />
        );

        const cerrarButton = screen.getByText('Cerrar');
        expect(cerrarButton).toBeInTheDocument();
        
        fireEvent.click(cerrarButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});