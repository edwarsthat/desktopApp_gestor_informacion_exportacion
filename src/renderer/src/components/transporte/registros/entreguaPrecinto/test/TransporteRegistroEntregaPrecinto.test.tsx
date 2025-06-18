/* eslint-disable prettier/prettier */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import { generateMockContenedor } from '@renderer/mock/contenedores';
import TransporteRegistroEntregaPrecinto from '../TransporteRegistroEntregaPrecinto';

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

vi.mock('@renderer/hooks/useFetchPaginatedList', () => ({
    useFetchPaginatedList: vi.fn(() => ({
        obtenerCantidadElementos: vi.fn(),
        obtenerData: vi.fn(),
        data: [
            generateMockContenedor(),
            generateMockContenedor()
        ],
        numeroElementos: 20,
    }))
}));

describe("Registro entrega precinto", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });
    it('debería renderizarse correctamente', () => {
        render(<TransporteRegistroEntregaPrecinto />);
        expect(screen.getByText('Registro entrega precinto')).toBeInTheDocument();
    });
    it('debería renderizar la tabla correctamente', () => {
        render(<TransporteRegistroEntregaPrecinto />);
        
        // Verificar que la tabla existe
        const tabla = document.querySelector('.table-main');
        expect(tabla).toBeInTheDocument();
        
        // Verificar que los headers están presentes
        expect(screen.getByText('Contenedor')).toBeInTheDocument();
        expect(screen.getByText('Cliente')).toBeInTheDocument();
        expect(screen.getByText('Entregó')).toBeInTheDocument();
        expect(screen.getByText('Recibió')).toBeInTheDocument();
        expect(screen.getByText('Fecha y hora de entrega')).toBeInTheDocument();
        expect(screen.getByText('Precinto')).toBeInTheDocument();
        expect(screen.getByText('Placa')).toBeInTheDocument();
        expect(screen.getByText('Trailer')).toBeInTheDocument();
        expect(screen.getByText('Observaciones')).toBeInTheDocument();
    });
    it('debería renderizar las filas de la tabla con los datos mock', () => {
        render(<TransporteRegistroEntregaPrecinto />);
        
        // Verificar que el tbody existe
        const tbody = document.querySelector('tbody');
        expect(tbody).toBeInTheDocument();
        
        // Verificar que se renderizan las filas (2 contenedores mock según el setup)
        const filas = document.querySelectorAll('tbody tr');
        expect(filas).toHaveLength(2);
        
        // Verificar que cada fila tiene el número correcto de celdas (7 columnas)
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            expect(celdas).toHaveLength(10);
        });
    });    
    it('debería permitir hacer clic en el icono de información sin errores', () => {
        render(<TransporteRegistroEntregaPrecinto />);
        
        // Buscar el primer icono de información (FcInfo)
        const iconoInfo = document.querySelector('td div[style*="color: blue"]');
        expect(iconoInfo).toBeInTheDocument();
        
        // Hacer clic en el icono usando fireEvent - no debería lanzar errores
        expect(() => {
            if (iconoInfo) {
                fireEvent.click(iconoInfo);
            }
        }).not.toThrow();
    });
})
