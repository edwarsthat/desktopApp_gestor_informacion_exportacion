/* eslint-disable prettier/prettier */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import ModalRegistroEficienciaOperativa from '../components/ModalRegistroEficienciaOperativa';
import { generateMockIndicadorProceso } from '@renderer/mock/indicadores';


// Mock del contexto de la aplicación
const mockSetLoading = vi.fn();
const mockMessageModal = vi.fn();
const mockObtenerData = vi.fn();

// Mock del contexto
vi.mock('@renderer/hooks/useAppContext', () => ({
    default: vi.fn(() => ({
        setLoading: mockSetLoading,
        messageModal: mockMessageModal,
        loading: false, // Por defecto no está cargando
    }))
}));


describe("Modal ingreso Indicadores Operaciones", () => {
    beforeEach(() => {
        // Mock de window.api.server2
        Object.defineProperty(window, 'api', {
            value: {
                server2: vi.fn().mockResolvedValue({
                    status: 200,
                    message: 'Success'
                })
            },
            writable: true
        });
    });
    
    afterEach(() => {
        vi.clearAllMocks();
        mockObtenerData.mockClear();
    });
    it('debería renderizarse correctamente', () => {
        const mockOnClose = vi.fn();
        const mockIndicador = generateMockIndicadorProceso();
        render(<ModalRegistroEficienciaOperativa
            open={true}
            onClose={mockOnClose}
            select={mockIndicador}
        />);
        expect(screen.getByText('Ingresar Eficiencia operativa')).toBeInTheDocument();
    });
    it('debería cerrar el modal al hacer clic en el botón Cerrar', () => {
        const mockOnClose = vi.fn();
        const mockIndicador = generateMockIndicadorProceso();

        render(<ModalRegistroEficienciaOperativa
            open={true}
            onClose={mockOnClose}
            select={mockIndicador}
        />);

        const botonCerrar = screen.getByText('Cerrar');
        fireEvent.click(botonCerrar);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    }); 
    it('debería renderizar todos los campos del formulario', () => {
        const mockOnClose = vi.fn();
        const mockIndicador = generateMockIndicadorProceso();

        render(<ModalRegistroEficienciaOperativa
            open={true}
            onClose={mockOnClose}
            select={mockIndicador}
        />);

        // Verificar que se renderizan los inputs del formulario
        const inputs = screen.getAllByRole('textbox');
        expect(inputs.length).toBeGreaterThan(0);        // Verificar que existe el botón Guardar
        expect(screen.getByText('Guardar')).toBeInTheDocument();
    });    
    it('debería mostrar error cuando se envía sin duración del turno', async () => {
        const mockOnClose = vi.fn();
        const mockIndicador = generateMockIndicadorProceso();
        
        render(<ModalRegistroEficienciaOperativa
            open={true}
            onClose={mockOnClose}
            select={mockIndicador}
        />);
        
        // Buscar el campo de duración del turno por su label y asegurar que esté vacío
        const inputDuracion = screen.getByLabelText('Duracion turno (horas)');
        fireEvent.change(inputDuracion, { target: { value: '' } });
        
        // Hacer clic en Guardar
        const botonGuardar = screen.getByText('Guardar');
        fireEvent.click(botonGuardar);
          // Verificar que aparece el mensaje de error
        await waitFor(() => {
            expect(screen.getByText('Duración del turno es requerida')).toBeInTheDocument();
        });
    });
    it('debería cerrar el modal y mostrar mensaje de éxito al enviar datos correctos', async () => {
        const mockOnClose = vi.fn();
        const mockIndicador = generateMockIndicadorProceso();
        
        render(<ModalRegistroEficienciaOperativa
            open={true}
            onClose={mockOnClose}
            select={mockIndicador}
        />);
        
        // Llenar los campos requeridos
        const inputDuracion = screen.getByLabelText('Duracion turno (horas)');
        const inputKilosMeta = screen.getByLabelText('Kilos meta procesados (hora)');
        
        fireEvent.change(inputDuracion, { target: { value: '8' } });
        fireEvent.change(inputKilosMeta, { target: { value: '1000' } });
        
        // Hacer clic en Guardar
        const botonGuardar = screen.getByText('Guardar');
        fireEvent.click(botonGuardar);
        
        // Verificar que se llamó la API
        await waitFor(() => {
            expect(window.api.server2).toHaveBeenCalledWith({
                action: "put_indicadores_operaciones_eficienciaOperativa",
                data: expect.objectContaining({
                    duracion_turno_horas: '8',
                    kilos_meta_hora: '1000'
                }),
                _id: mockIndicador._id
            });
        });
        
        // Verificar que se muestra el mensaje de éxito
        await waitFor(() => {
            expect(mockMessageModal).toHaveBeenCalledWith("success", "Registro modificado correctamente");
        });
        
        // Verificar que se cierra el modal
        await waitFor(() => {
            expect(mockOnClose).toHaveBeenCalled();
        });
    });
})