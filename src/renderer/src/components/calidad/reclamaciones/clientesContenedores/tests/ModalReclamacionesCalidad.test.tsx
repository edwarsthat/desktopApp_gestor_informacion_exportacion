/* eslint-disable prettier/prettier */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";

// Importaciones normales
import ModalReclamacionesCalidad from '../components/ModalReclamacionesCalidad';
import { generateMockContenedor } from '@renderer/mock/contenedores';

// Mock de formatearFecha
vi.mock('@renderer/functions/fechas', () => ({
    formatearFecha: vi.fn().mockImplementation((fecha) => {
        if (fecha instanceof Date) {
            return fecha.toLocaleDateString('es-ES');
        }
        if (typeof fecha === 'string') {
            return new Date(fecha).toLocaleDateString('es-ES');
        }
        return 'fecha-formateada';
    })
}));
// Mock del contexto de la aplicación
const mockMessageModal = vi.fn();
const mockSetLoading = vi.fn();

vi.mock('@renderer/hooks/useAppContext', () => ({
    default: vi.fn(() => ({
        messageModal: mockMessageModal,
        setLoading: mockSetLoading,
        loading: false,
        user: {},
        seleccionWindow: vi.fn(),
        statusProceso: false,
        eventoServidor: vi.fn(),
        triggerServer: vi.fn()
    }))
}));

// Limpiamos después de cada test
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    // Resetear los mocks específicos
    mockMessageModal.mockClear();
    mockSetLoading.mockClear();
});

describe('Modal reclamacionesClientes Component', () => {
    it('debería renderizar el componente correctamente sin contenedor', () => {
        const mockOnClose = vi.fn();
        render(<ModalReclamacionesCalidad open={true} onClose={mockOnClose} contenedor={undefined} />);
        expect(screen.getByText('Reclamaciones calidad')).toBeInTheDocument();
        expect(screen.getByText('No hay información de reclamación disponible')).toBeInTheDocument();
    });

    it('debería renderizar el componente correctamente con contenedor', () => {
        const mockOnClose = vi.fn();
        const mockContenedor = generateMockContenedor();
        render(<ModalReclamacionesCalidad open={true} onClose={mockOnClose} contenedor={mockContenedor} />);
        expect(screen.getByText('Reclamaciones calidad')).toBeInTheDocument();
    });

    it('debería cerrar el modal al hacer click en el botón de cerrar', async () => {
        const mockOnClose = vi.fn();
        const mockContenedor = generateMockContenedor();

        render(<ModalReclamacionesCalidad open={true} onClose={mockOnClose} contenedor={mockContenedor} />);

        // Buscar el botón de cerrar por su aria-label
        const closeButton = screen.getByLabelText('Cerrar');
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('debería mostrar correctamente los datos del responsable', () => {
        const mockOnClose = vi.fn();
        const mockContenedor = generateMockContenedor({
            reclamacionCalidad: {
                responsable: 'Responsable Test',
                Cargo: 'Inspector',
                telefono: '3011234567',
                correo: 'test@cliente.com',
                cliente: 'Cliente Test',
                contenedor: 'CONT123',
                fechaArribo: '2025-05-25',
                kilos: '1000',
                cajas: '50',
                fechaDeteccion: '2025-05-26',
                moho_encontrado: '5',
                moho_permitido: '2',
                golpes_encontrado: '1',
                golpes_permitido: '0',
                frio_encontrado: '0',
                frio_permitido: '0',
                maduracion_encontrado: '3',
                maduracion_permitido: '1',
                otroDefecto: 'Ninguno',
                observaciones: 'Observación de prueba',
                archivosSubidos: []
            }
        });

        render(<ModalReclamacionesCalidad open={true} onClose={mockOnClose} contenedor={mockContenedor} />);

        // Verificamos que se muestra el responsable que pusimos en el mock
        expect(screen.getByText('Responsable Test')).toBeInTheDocument();
    });

    it('debería mostrar los archivos adjuntos si existen', () => {
        const mockOnClose = vi.fn();
        const mockContenedor = generateMockContenedor({
            reclamacionCalidad: {
                responsable: 'Responsable Test',
                Cargo: 'Inspector',
                telefono: '3011234567',
                correo: 'test@cliente.com',
                cliente: 'Cliente Test',
                contenedor: 'CONT123',
                fechaArribo: '2025-05-25',
                kilos: '1000',
                cajas: '50',
                fechaDeteccion: '2025-05-26',
                moho_encontrado: '5',
                moho_permitido: '2',
                golpes_encontrado: '1',
                golpes_permitido: '0',
                frio_encontrado: '0',
                frio_permitido: '0',
                maduracion_encontrado: '3',
                maduracion_permitido: '1',
                otroDefecto: 'Ninguno',
                observaciones: 'Observación de prueba',
                archivosSubidos: ['archivo1.pdf', 'archivo2.pdf']  // <<< aquí le pasas archivos
            }
        });

        render(<ModalReclamacionesCalidad open={true} onClose={mockOnClose} contenedor={mockContenedor} />);

        // Esperamos que se muestren los textos "Documento 1" y "Documento 2"
        expect(screen.getByText('Documento 1')).toBeInTheDocument();
        expect(screen.getByText('Documento 2')).toBeInTheDocument();
    });

    it('debería llamar a descargarArchivo al hacer click en un archivo', async () => {
        const mockOnClose = vi.fn();

        // Mockeamos window.api.server2
        const mockServer2 = vi.fn().mockResolvedValue({
            status: 200,
            data: {
                base64: btoa('mock file content'),
                mimeType: 'application/pdf',
                fileName: 'archivo-mock.pdf'
            }
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.api = { server2: mockServer2 };

        const mockContenedor = generateMockContenedor({
            reclamacionCalidad: {
                responsable: 'Responsable Test',
                Cargo: 'Inspector',
                telefono: '3011234567',
                correo: 'test@cliente.com',
                cliente: 'Cliente Test',
                contenedor: 'CONT123',
                fechaArribo: '2025-05-25',
                kilos: '1000',
                cajas: '50',
                fechaDeteccion: '2025-05-26',
                moho_encontrado: '5',
                moho_permitido: '2',
                golpes_encontrado: '1',
                golpes_permitido: '0',
                frio_encontrado: '0',
                frio_permitido: '0',
                maduracion_encontrado: '3',
                maduracion_permitido: '1',
                otroDefecto: 'Ninguno',
                observaciones: 'Observación de prueba',
                archivosSubidos: ['archivo1.pdf']
            }
        });

        render(<ModalReclamacionesCalidad open={true} onClose={mockOnClose} contenedor={mockContenedor} />);

        const archivoLink = screen.getByText('Documento 1');
        fireEvent.click(archivoLink);

        await waitFor(() => {
            expect(mockServer2).toHaveBeenCalledTimes(1);
            expect(mockServer2).toHaveBeenCalledWith(expect.objectContaining({
                url: 'archivo1.pdf',
                action: 'get_calidad_reclamaciones_contenedores_obtenerArchivo'
            }));
        });
    });    it('debería mostrar un error si la descarga falla', async () => {
        const mockOnClose = vi.fn();

        const mockServer2 = vi.fn().mockResolvedValue({
            status: 500,
            message: 'Internal Server Error'
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.api = { server2: mockServer2 };

        const mockContenedor = generateMockContenedor({
            reclamacionCalidad: {
                responsable: 'Responsable Test',
                Cargo: 'Inspector',
                telefono: '3011234567',
                correo: 'test@cliente.com',
                cliente: 'Cliente Test',
                contenedor: 'CONT123',
                fechaArribo: '2025-05-25',
                kilos: '1000',
                cajas: '50',
                fechaDeteccion: '2025-05-26',
                moho_encontrado: '5',
                moho_permitido: '2',
                golpes_encontrado: '1',
                golpes_permitido: '0',
                frio_encontrado: '0',
                frio_permitido: '0',
                maduracion_encontrado: '3',
                maduracion_permitido: '1',
                otroDefecto: 'Ninguno',
                observaciones: 'Observación de prueba',
                archivosSubidos: ['archivo1.pdf']
            }
        });

        render(<ModalReclamacionesCalidad open={true} onClose={mockOnClose} contenedor={mockContenedor} />);

        const archivoLink = screen.getByText('Documento 1');
        fireEvent.click(archivoLink);

        await waitFor(() => {
            expect(mockMessageModal).toHaveBeenCalledWith('error', expect.stringContaining('Code 500'));
        });
    });


})