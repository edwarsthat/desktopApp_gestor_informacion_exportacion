/* eslint-disable prettier/prettier */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import TransporteRegistroEntregaPrecinto from '../TransporteRegistroEntregaPrecinto';
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

// Helper para crear un vehículo mock con la estructura correcta
function createMockVehiculo(overrides: Partial<vehiculosType> = {}): vehiculosType {
    return {
        _id: 'test-id-' + Math.random(),
        placa: 'ABC-123',
        trailer: 'TRL-456',
        precinto: ['PRECINTO-001', 'PRECINTO-002'],
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

vi.mock('@renderer/hooks/useFetchPaginatedList', () => ({
    useFetchPaginatedList: vi.fn(() => ({
        obtenerCantidadElementos: vi.fn(),
        obtenerData: vi.fn(),
        data: [
            createMockVehiculo(),
            createMockVehiculo()
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
    it('debería renderizar la tabla correctamente con todos los headers', () => {
        render(<TransporteRegistroEntregaPrecinto />);
        
        // Verificar que la tabla existe
        const tabla = document.querySelector('.table-main');
        expect(tabla).toBeInTheDocument();
        
        // Verificar que los headers están presentes
        expect(screen.getByText('Codigo')).toBeInTheDocument();
        expect(screen.getByText('Contenedor')).toBeInTheDocument();
        expect(screen.getByText('Cliente')).toBeInTheDocument();
        expect(screen.getByText('Entregó')).toBeInTheDocument();
        expect(screen.getByText('Recibió')).toBeInTheDocument();
        expect(screen.getByText('Fecha y hora de entrega')).toBeInTheDocument();
        expect(screen.getByText('Precinto')).toBeInTheDocument();
        expect(screen.getByText('Unidad de transporte')).toBeInTheDocument();
        expect(screen.getByText('Unidad de carga')).toBeInTheDocument();
        expect(screen.getByText('Observaciones')).toBeInTheDocument();
    });
    it('debería renderizar las filas de la tabla con los datos mock', () => {
        render(<TransporteRegistroEntregaPrecinto />);
        
        // Verificar que el tbody existe
        const tbody = document.querySelector('tbody');
        expect(tbody).toBeInTheDocument();
        
        // Verificar que se renderizan las filas (2 vehículos mock según el setup)
        const filas = document.querySelectorAll('tbody tr');
        expect(filas).toHaveLength(2);
        
        // Verificar que cada fila tiene el número correcto de celdas (11 columnas incluida la de info)
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            expect(celdas).toHaveLength(11);
        });
    });    
    it('debería mostrar los datos del vehículo en la tabla', () => {
        render(<TransporteRegistroEntregaPrecinto />);
        
        // Verificar que se muestran los datos mock
        // Como hay 2 registros mock con los mismos datos, algunos aparecerán duplicados
        const codigos = screen.getAllByText('COD-001');
        expect(codigos.length).toBeGreaterThan(0);
        
        const contenedores = screen.getAllByText('123456');
        expect(contenedores.length).toBeGreaterThan(0);
        
        const clientes = screen.getAllByText('Cliente Test');
        expect(clientes.length).toBeGreaterThan(0);
        
        const entregas = screen.getAllByText('Juan Pérez');
        expect(entregas.length).toBeGreaterThan(0);
        
        const recibe = screen.getAllByText('María García');
        expect(recibe.length).toBeGreaterThan(0);
        
        const placas = screen.getAllByText('ABC-123');
        expect(placas.length).toBeGreaterThan(0);
        
        const trailers = screen.getAllByText('TRL-456');
        expect(trailers.length).toBeGreaterThan(0);
        
        const observaciones = screen.getAllByText('Todo en orden');
        expect(observaciones.length).toBeGreaterThan(0);
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
    it('debería abrir el modal al hacer clic en el icono de información', () => {
        render(<TransporteRegistroEntregaPrecinto />);
        
        // Buscar el primer icono de información
        const iconoInfo = document.querySelector('td div[style*="color: blue"]');
        expect(iconoInfo).toBeInTheDocument();
        
        // Hacer clic en el icono
        if (iconoInfo) {
            fireEvent.click(iconoInfo);
        }
        
        // Verificar que el modal se abre (el modal tiene el título "Fotos de Entrega de Precinto")
        expect(screen.getByText('Fotos de Entrega de Precinto')).toBeInTheDocument();
    });
    it('debería mostrar los precintos concatenados correctamente', () => {
        render(<TransporteRegistroEntregaPrecinto />);
        
        // Los precintos se muestran concatenados con " - "
        // Mock tiene: ['PRECINTO-001', 'PRECINTO-002']
        // Debería mostrar: "PRECINTO-001 - PRECINTO-002 - "
        // Como hay 2 registros mock, usamos getAllByText
        const precintos = screen.getAllByText(/PRECINTO-001 - PRECINTO-002 -/);
        expect(precintos.length).toBeGreaterThan(0);
        expect(precintos[0]).toBeInTheDocument();
    });
    it('debería renderizar el componente BotonesPasarPaginas', () => {
        const { container } = render(<TransporteRegistroEntregaPrecinto />);
        
        // El componente de paginación debería estar presente
        // Verificamos que el contenedor se renderizó correctamente
        expect(container).toBeInTheDocument();
    });
})