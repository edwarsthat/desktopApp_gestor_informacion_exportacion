/* eslint-disable prettier/prettier */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import "@testing-library/jest-dom";
import { generateMockIndicadorProceso } from '@renderer/mock/indicadores';
import RegistrosEficienciaOperativa from '../RegistrosEficienciaOperativa';

// Mock del contexto de la aplicación
const mockSetLoading = vi.fn();
const mockMessageModal = vi.fn();
const mockObtenerData = vi.fn();

// Mock del contexto
vi.mock('@renderer/hooks/useAppContext', () => ({
    default: vi.fn(() => ({
        setLoading: mockSetLoading,
        messageModal: mockMessageModal,
    }))
}));
vi.mock('@renderer/hooks/useFetchPaginatedList', () => ({
    useFetchPaginatedList: vi.fn(() => ({
        obtenerCantidadElementos: vi.fn(),
        obtenerData: mockObtenerData,
        data: [
            generateMockIndicadorProceso(),
            generateMockIndicadorProceso()
        ],
        numeroElementos: 100,
    }))
}));

describe("Indicadores Operaciones", () => {
    afterEach(() => {
        vi.clearAllMocks();
        mockObtenerData.mockClear();
    });
    it('debería renderizarse correctamente', () => {
        render(<RegistrosEficienciaOperativa />);
        expect(screen.getByText('Registros indicadores eficiencia operativa')).toBeInTheDocument();
    });
    it('debería renderizar una fila por cada elemento de data', () => {
        render(<RegistrosEficienciaOperativa />);
        const filas = screen.getAllByRole('row');
        expect(filas.length - 1).toBe(2);
    });
    it('debería mostrar los tipos de fruta en cada fila', () => {
        render(<RegistrosEficienciaOperativa />);
        const filas = screen.getAllByRole('row');
        filas.slice(1).forEach(fila => {
            expect(within(fila).getByText(/Naranja/)).toBeInTheDocument();
            expect(within(fila).getByText(/Limon/)).toBeInTheDocument();
        });
    });
    it('debería abrir el modal al hacer click en el ícono de editar', () => {
        render(<RegistrosEficienciaOperativa />);
        const iconosEditar = screen.getAllByRole('button', { hidden: true });
        fireEvent.click(iconosEditar[0]);
        expect(screen.getByText('Ingresar Eficiencia operativa')).toBeInTheDocument();
    });
    it('debería llamar a obtenerData al cambiar de página', async () => {
        render(<RegistrosEficienciaOperativa />);

        mockObtenerData.mockClear();

        const botones = screen.getAllByRole('button');
        const botonSiguiente = botones[botones.length - 1];

        fireEvent.click(botonSiguiente);
        await new Promise(resolve => setTimeout(resolve, 400));

        expect(mockObtenerData).toHaveBeenCalled();
    }); 
    it('debería mostrar el total correcto de kilos procesados por registro', () => {
        render(<RegistrosEficienciaOperativa />);

        // Buscar las celdas que muestran los kilos procesados
        const celdasKilos = screen.getAllByText(/\d+\.\d{2} Kg/);

        // Verificar que se muestran los totales (debería haber 2 filas de datos)
        expect(celdasKilos).toHaveLength(2);
        // Verificar que el formato es correcto (número con 2 decimales + "Kg")
        celdasKilos.forEach(celda => {
            expect(celda.textContent).toMatch(/^\d+\.\d{2} Kg$/);
        });
    });
});