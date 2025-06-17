/* eslint-disable prettier/prettier */
import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import { generateMockContenedor } from '@renderer/mock/contenedores';
import ModalFotosEntregaPrecinto from '../components/ModalFotosEntregaPrecinto';


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
        const mockContenedor = generateMockContenedor();

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
        const mockContenedor = generateMockContenedor();
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
        const mockContenedor = generateMockContenedor();

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
        const mockContenedor = generateMockContenedor();

        render(
            <ModalFotosEntregaPrecinto
                open={true}
                onClose={mockOnClose}
                contenedorSeleccionado={mockContenedor}
            />
        );

        expect(screen.getByText('Cargando fotos...')).toBeInTheDocument();
    });
});