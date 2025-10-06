/* eslint-disable prettier/prettier */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import EntregaPrescinto from '../EntregaPrescinto';

// Simula window.api.server2 con datos randomizados
function mockServer2ResponseWithData(mockData: unknown[]): void {
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

// Mock del contexto de la aplicación
const mockMessageModal = vi.fn();
const mockSetLoading = vi.fn();
// Mock del contexto
vi.mock('@renderer/hooks/useAppContext', () => ({
    default: vi.fn(() => ({
        messageModal: mockMessageModal,
        setLoading: mockSetLoading,
        loading: false,
    }))
}));



describe('EntregaPrescinto', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });
    it('debería renderizarse correctamente', () => {
        render(<EntregaPrescinto />);
        expect(screen.getByText('Entrega documentos y precinto')).toBeInTheDocument();
    });
    it('debería mostrar los contenedores en el select', async () => {
        // Creamos datos mock aleatorios con la estructura correcta de vehiculosType
        const mockContenedores = [
            {
                _id: 'abc123',
                placa: 'ABC-123',
                contenedor: {
                    numeroContenedor: '123',
                    infoContenedor: {
                        clienteInfo: {
                            CLIENTE: 'Cliente Test 1'
                        }
                    }
                }
            },
            {
                _id: 'def456',
                placa: 'DEF-456',
                contenedor: {
                    numeroContenedor: '456',
                    infoContenedor: {
                        clienteInfo: {
                            CLIENTE: 'Cliente Test 2'
                        }
                    }
                }
            }
        ];
        mockServer2ResponseWithData(mockContenedores);

        render(<EntregaPrescinto />);
        // Espera a que los textos estén disponibles
        await waitFor(() => {
            expect(screen.getByText(/123.*Cliente Test 1.*ABC-123/)).toBeInTheDocument();
            expect(screen.getByText(/456.*Cliente Test 2.*DEF-456/)).toBeInTheDocument();
        });
    });
    it("deberia mostrar error si se intenta guardar sin fotos", async () => {
        const mockContenedores = [
            {
                _id: 'abc123',
                placa: 'ABC-123',
                contenedor: {
                    numeroContenedor: '123',
                    infoContenedor: {
                        clienteInfo: {
                            CLIENTE: 'Cliente Test 1'
                        }
                    }
                }
            }
        ];
        mockServer2ResponseWithData(mockContenedores);
        render(<EntregaPrescinto />);
        // Espera a que cargue el select
        await screen.findByText(/123.*Cliente Test 1.*ABC-123/);

        // Haz click en guardar (el botón es el único de tipo submit)
        const guardarBtn = screen.getByRole('button', { name: /guardar/i });
        fireEvent.click(guardarBtn);

        // Espera a que aparezca el error de las fotos
        expect(await screen.findByText(/Por favor ingrese de 1 a 3 fotos como maximo/i)).toBeInTheDocument()
    });
    it("deberia guardar correctamente y msotrar mensaje de éxito", async () => {
        const mockContenedores = [
            {
                _id: 'abc123',
                placa: 'ABC-123',
                contenedor: {
                    numeroContenedor: '123',
                    infoContenedor: {
                        clienteInfo: {
                            CLIENTE: 'Cliente Test 1'
                        }
                    }
                }
            }
        ];
        mockServer2ResponseWithData(mockContenedores);
        // Mock de respuesta exitosa al guardar
        window.api.server2 = vi.fn()
            .mockResolvedValueOnce({ status: 200, data: mockContenedores }) // para cargar contenedores
            .mockResolvedValueOnce({ status: 200 }); // para guardar entrega

        render(<EntregaPrescinto />);
        await screen.findByText(/123.*Cliente Test 1.*ABC-123/);

        // Llenar campos requeridos del formulario
        fireEvent.change(screen.getByLabelText(/Contenedores/i), { target: { value: 'abc123' } });
        fireEvent.change(screen.getByLabelText('Entrega'), { target: { value: "Persona Entrega" } });
        fireEvent.change(screen.getByLabelText('Recibe'), { target: { value: "Persona Recibe" } });
        fireEvent.change(screen.getByLabelText('Fecha de Entrega'), { target: { value: "2025-07-15T08:30" } });        // Simular subida de una imagen válida
        const file = new File(['foto'], 'foto.jpg', {
            type: 'image/jpeg'
        }) as File;
        const input = screen.getByLabelText(/fotos/i) as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });

        // Hacer submit
        const guardarBtn = screen.getByRole('button', { name: /guardar/i });
        fireEvent.click(guardarBtn);

        // Espera al mensaje de éxito
        await waitFor(() => {
            expect(mockMessageModal).toHaveBeenCalledWith('success', expect.stringMatching(/guardada correctamente/i));
        });
    });
    it("debería mostrar mensaje de error si la API falla al guardar la entrega", async () => {
        const mockContenedores = [
            {
                _id: 'abc123',
                placa: 'ABC-123',
                contenedor: {
                    numeroContenedor: '123',
                    infoContenedor: {
                        clienteInfo: {
                            CLIENTE: 'Cliente Test 1'
                        }
                    }
                }
            }
        ];
        mockServer2ResponseWithData(mockContenedores);
        // Mock de respuesta exitosa para cargar contenedores y error para guardar
        window.api.server2 = vi.fn()
            .mockResolvedValueOnce({ status: 200, data: mockContenedores }) // para cargar contenedores
            .mockResolvedValueOnce({ status: 500, message: "Error en el servidor" }); // para guardar entrega

        render(<EntregaPrescinto />);
        await screen.findByText(/123.*Cliente Test 1.*ABC-123/);


        // Llenar campos requeridos del formulario
        fireEvent.change(screen.getByLabelText('Contenedores'), { target: { value: 'abc123' } });
        fireEvent.change(screen.getByLabelText('Entrega'), { target: { value: "Persona Entrega" } });
        fireEvent.change(screen.getByLabelText('Recibe'), { target: { value: "Persona Recibe" } });
        fireEvent.change(screen.getByLabelText('Fecha de Entrega'), { target: { value: "2025-07-15T08:30" } });

        // Simular subida de una imagen válida
        const file = new File(['foto'], 'foto.jpg', {
            type: 'image/jpeg'
        }) as File;
        const input = screen.getByLabelText(/fotos/i) as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });

        // Hacer submit
        const guardarBtn = screen.getByRole('button', { name: /guardar/i });
        fireEvent.click(guardarBtn);

        // Espera al mensaje de error
        await waitFor(() => {
            expect(mockMessageModal).toHaveBeenCalledWith('error', expect.stringMatching(/Error en el servidor/i));
        });
    });
    it('debería mostrar error si falta el campo "Entrega"', async () => {
        const mockContenedores = [
            {
                _id: 'abc123',
                placa: 'KNG-001',
                contenedor: {
                    numeroContenedor: '1356',
                    infoContenedor: {
                        clienteInfo: {
                            CLIENTE: 'KONGELATO'
                        }
                    }
                }
            }
        ];
        mockServer2ResponseWithData(mockContenedores);

        render(<EntregaPrescinto />);
        await screen.findByText(/1356.*KONGELATO.*KNG-001/);

        // Llenar todos los campos menos "Entrega"
        fireEvent.change(screen.getByLabelText('Contenedores'), { target: { value: 'abc123' } });
        // fireEvent.change(screen.getByLabelText('Entrega'), { target: { value: "" } }); // Lo dejamos vacío
        fireEvent.change(screen.getByLabelText('Recibe'), { target: { value: "Stheven" } });
        fireEvent.change(screen.getByLabelText('Fecha de Entrega'), { target: { value: "2025-05-05T08:55" } });

        // Subir una foto válida
        const file = new File(['foto'], 'foto.jpg', { type: 'image/jpeg' });
        const input = screen.getByLabelText(/fotos/i);
        fireEvent.change(input, { target: { files: [file] } });

        // Hacer submit
        const guardarBtn = screen.getByRole('button', { name: /guardar/i });
        fireEvent.click(guardarBtn);

        // Esperar el mensaje de error exacto
        expect(await screen.findByText("El nombre de quien entrega es obligatorio")).toBeInTheDocument();
    });
    it('debería mostrar error si se intenta subir un archivo que no es imagen', async () => {
        const mockContenedores = [
            {
                _id: 'abc123',
                placa: 'KNG-001',
                contenedor: {
                    numeroContenedor: '1356',
                    infoContenedor: {
                        clienteInfo: {
                            CLIENTE: 'KONGELATO'
                        }
                    }
                }
            }
        ];
        mockServer2ResponseWithData(mockContenedores);

        render(<EntregaPrescinto />);
        await screen.findByText(/1356.*KONGELATO.*KNG-001/);

        // Llenar campos requeridos
        fireEvent.change(screen.getByLabelText('Contenedores'), { target: { value: 'abc123' } });
        fireEvent.change(screen.getByLabelText('Entrega'), { target: { value: "Stheven" } });
        fireEvent.change(screen.getByLabelText('Recibe'), { target: { value: "Stheven" } });
        fireEvent.change(screen.getByLabelText('Fecha de Entrega'), { target: { value: "2025-05-05T08:55" } });

        // Subir archivo no imagen
        const file = new File(['test'], 'documento.pdf', { type: 'application/pdf' });
        const input = screen.getByLabelText(/fotos/i);
        fireEvent.change(input, { target: { files: [file] } });

        // Hacer submit
        const guardarBtn = screen.getByRole('button', { name: /guardar/i });
        fireEvent.click(guardarBtn);

        // Esperar mensaje de error de tipo de archivo
        expect(await screen.findByText(/solo se permiten archivos de imagen/i)).toBeInTheDocument();
    });
    it('debería limpiar el formulario después de guardar exitosamente', async () => {
        const mockContenedores = [
            {
                _id: 'abc123',
                placa: 'KNG-001',
                contenedor: {
                    numeroContenedor: '1356',
                    infoContenedor: {
                        clienteInfo: {
                            CLIENTE: 'KONGELATO'
                        }
                    }
                }
            }
        ];

        mockServer2ResponseWithData(mockContenedores);

        // Mock de respuesta exitosa para guardar (puedes simular que recarga contenedores después)
        window.api.server2 = vi.fn()
            .mockResolvedValueOnce({ status: 200, data: mockContenedores }) // cargar contenedores al montar
            .mockResolvedValueOnce({ status: 200 }) // guardar
            .mockResolvedValueOnce({ status: 200, data: mockContenedores }); // recarga contenedores tras guardar

        render(<EntregaPrescinto />);
        await screen.findByText(/1356.*KONGELATO.*KNG-001/);

        // Llenar campos requeridos
        fireEvent.change(screen.getByLabelText('Contenedores'), { target: { value: 'abc123' } });
        fireEvent.change(screen.getByLabelText('Entrega'), { target: { value: "Stheven" } });
        fireEvent.change(screen.getByLabelText('Recibe'), { target: { value: "Andrés" } });
        fireEvent.change(screen.getByLabelText('Fecha de Entrega'), { target: { value: "2025-05-05T08:55" } });

        // Subir una foto válida
        const file = new File(['foto'], 'foto.jpg', { type: 'image/jpeg' });
        const input = screen.getByLabelText(/fotos/i) as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });

        // Hacer submit
        const guardarBtn = screen.getByRole('button', { name: /guardar/i });
        fireEvent.click(guardarBtn);

        // Esperar el mensaje de éxito
        await waitFor(() => {
            expect(mockMessageModal).toHaveBeenCalledWith('success', expect.stringMatching(/guardada correctamente/i));
        });

        // Verificar que los campos se hayan reseteado
        expect((screen.getByLabelText('Contenedores') as HTMLInputElement).value).toBe('');
        expect((screen.getByLabelText('Entrega') as HTMLInputElement).value).toBe('');
        expect((screen.getByLabelText('Recibe') as HTMLInputElement).value).toBe('');
        expect((screen.getByLabelText('Fecha de Entrega') as HTMLInputElement).value).toBe('');
        // Observaciones también debería estar vacío si lo tienes
        expect((screen.getByLabelText('Observaciones') as HTMLInputElement).value).toBe('');
        // Las fotos deben haberse limpiado
        // El input de tipo file no tiene .value legible para archivos en tests, pero puedes comprobar que no hay error de fotos mostrado:
        expect(screen.queryByText(/Porfavor ingrese de 1 a 3 fotos como maximo/i)).not.toBeInTheDocument();
    });
});
