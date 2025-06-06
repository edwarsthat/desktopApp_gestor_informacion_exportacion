/* eslint-disable prettier/prettier */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";
import { contenedoresType } from '@renderer/types/contenedoresType';

// Importaciones normales
import ReclamacionesClientes from '../ReclamacionesClientes';
import { formatearFecha } from '@renderer/functions/fechas';
import { useFetchPaginatedList } from '@renderer/hooks/useFetchPaginatedList';
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

// Mock del contexto
vi.mock('@renderer/hooks/useAppContext', () => ({
    default: (): { setLoading: (loading: boolean) => void } => ({
        setLoading: vi.fn()
    })
}));

// Creamos los datos mock FUERA del mock para evitar problemas de resolución de módulos
const defaultMockData = [
    generateMockContenedor({
        _id: '1',
        numeroContenedor: 'CONT123',
        reclamacionCalidad: {
            fecha: new Date('2025-01-01'),
            cliente: 'Cliente Test',
            responsable: 'Responsable Test',
            Cargo: 'Inspector',
            telefono: '3011234567',
            correo: 'cliente@mock.com'
        }
    }),
    generateMockContenedor({
        _id: '2',
        numeroContenedor: 'CONT456',
        reclamacionCalidad: {
            fecha: new Date('2025-01-02'),
            cliente: 'Cliente Test 2',
            responsable: 'Responsable Test 2',
            Cargo: 'Supervisor',
            telefono: '3011234568',
            correo: 'cliente2@mock.com'
        }
    }),
    generateMockContenedor({
        _id: '3',
        numeroContenedor: 'CONT789',
        reclamacionCalidad: {
            fecha: new Date('2025-01-03'),
            cliente: 'Cliente Test 3',
            responsable: 'Responsable Test 3',
            Cargo: 'Gerente',
            telefono: '3011234569',
            correo: 'cliente3@mock.com'
        }
    })
];

// Mock del hook de paginación
vi.mock('@renderer/hooks/useFetchPaginatedList', () => {
    const obtenerDataMock = vi.fn().mockResolvedValue(undefined);
    const obtenerCantidadElementosMock = vi.fn().mockResolvedValue(undefined);

    const mockedUseFetchPaginatedList = vi.fn().mockImplementation(() => {
        return {
            obtenerData: obtenerDataMock,
            obtenerCantidadElementos: obtenerCantidadElementosMock,
            data: defaultMockData,
            numeroElementos: defaultMockData.length
        };
    });

    return {
        useFetchPaginatedList: mockedUseFetchPaginatedList
    };
});

// Mock del componente ModalReclamacionesCalidad
vi.mock('../components/ModalReclamacionesCalidad', () => ({
    default: (props: { open: boolean; onClose: () => void; contenedor: contenedoresType | undefined }): JSX.Element | null =>
        props.open ? <div role="dialog" data-testid="modal-reclamaciones">Modal Content</div> : null
}));

// Limpiamos después de cada test
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

describe('ReclamacionesClientes Component', () => {
    it('debería renderizar el componente correctamente', () => {
        render(<ReclamacionesClientes />);
        expect(screen.getByText('Reclamaciones calidad')).toBeInTheDocument();
    });

    it('debería mostrar las columnas correctas en la tabla', () => {
        render(<ReclamacionesClientes />);
        const headers = ['Fecha creacion', 'Numero contenedor', 'Cliente'];
        headers.forEach(header => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });
    });    it('debería mostrar los datos de los contenedores correctamente', () => {
        render(<ReclamacionesClientes />);
        expect(screen.getByText('CONT123')).toBeInTheDocument();
        expect(screen.getByText('CONT456')).toBeInTheDocument();
        expect(screen.getByText('CONT789')).toBeInTheDocument();
        expect(screen.getByText('Cliente Test')).toBeInTheDocument();
        expect(screen.getByText('Cliente Test 2')).toBeInTheDocument();
        expect(screen.getByText('Cliente Test 3')).toBeInTheDocument();
    });

    it('debería mostrar todos los íconos de información para cada contenedor', () => {
        render(<ReclamacionesClientes />);
        const infoIcons = screen.getAllByText('', { selector: 'div[style="color: blue;"]' });
        expect(infoIcons).toHaveLength(3); // Esperamos 3 íconos para 3 contenedores
    });it('debería abrir el modal al hacer click en el ícono de información', () => {
        render(<ReclamacionesClientes />);
        const infoIconContainers = screen.getAllByText('', { selector: 'div[style="color: blue;"]' });
        fireEvent.click(infoIconContainers[0]);
        expect(screen.getByTestId('modal-reclamaciones')).toBeInTheDocument();
    });

    it('debería llamar a las funciones de carga de datos al montar el componente', () => {
        // Accedemos al mock del hook
        const mockUseFetchPaginatedList = vi.mocked(useFetchPaginatedList);
        
        render(<ReclamacionesClientes />);

        // Verificamos que el hook fue llamado
        expect(mockUseFetchPaginatedList).toHaveBeenCalled();
    });    it('debería mostrar las fechas formateadas correctamente', () => {
        render(<ReclamacionesClientes />);
        
        // Verificamos que formatearFecha fue llamado con las fechas correctas
        expect(formatearFecha).toHaveBeenCalledWith(new Date('2025-01-01'));
        expect(formatearFecha).toHaveBeenCalledWith(new Date('2025-01-02'));
        expect(formatearFecha).toHaveBeenCalledWith(new Date('2025-01-03'));
    });

    it('debería manejar correctamente cuando no hay datos', () => {
        // Mockeamos el hook para que devuelva datos vacíos
        const mockUseFetchPaginatedList = vi.mocked(useFetchPaginatedList);
        mockUseFetchPaginatedList.mockReturnValue({
            obtenerData: vi.fn(),
            obtenerCantidadElementos: vi.fn(),
            data: [],
            numeroElementos: 0
        });

        render(<ReclamacionesClientes />);
        
        // Verificamos que el título y headers se muestran aunque no haya datos
        expect(screen.getByText('Reclamaciones calidad')).toBeInTheDocument();
        expect(screen.getByText('Fecha creacion')).toBeInTheDocument();
        
        // Verificamos que no hay íconos de información
        const infoIcons = screen.queryAllByText('', { selector: 'div[style="color: blue;"]' });
        expect(infoIcons).toHaveLength(0);
    });

    it('debería poder crear múltiples escenarios de test with generateMockContenedor', () => {
        // Este test demuestra cómo crear diferentes escenarios
        const contenedorConDefectos = generateMockContenedor({
            numeroContenedor: 'DEFECT001',
            reclamacionCalidad: {
                cliente: 'Cliente con Defectos',
                moho_encontrado: '15',
                golpes_encontrado: '3',
                observaciones: 'Contenedor con múltiples defectos'
            }
        });

        const contenedorPerfecto = generateMockContenedor({
            numeroContenedor: 'PERFECT001',
            reclamacionCalidad: {
                cliente: 'Cliente Satisfecho',
                moho_encontrado: '0',
                golpes_encontrado: '0',
                observaciones: 'Excelente calidad'
            }
        });

        // Verificamos que los objetos mock se crean correctamente
        expect(contenedorConDefectos.numeroContenedor).toBe('DEFECT001');
        expect(contenedorConDefectos.reclamacionCalidad.cliente).toBe('Cliente con Defectos');
        expect(contenedorConDefectos.reclamacionCalidad.moho_encontrado).toBe('15');
        
        expect(contenedorPerfecto.numeroContenedor).toBe('PERFECT001');
        expect(contenedorPerfecto.reclamacionCalidad.cliente).toBe('Cliente Satisfecho');
        expect(contenedorPerfecto.reclamacionCalidad.moho_encontrado).toBe('0');
    });
    it('debería crear diferentes tipos de reclamaciones con facilidad', () => {
        // Contenedor con alta cantidad de defectos
        const contenedorMalaCalidad = generateMockContenedor({
            numeroContenedor: 'BAD001',
            reclamacionCalidad: {
                cliente: 'Cliente Insatisfecho',
                responsable: 'Inspector Senior',
                Cargo: 'Supervisor de Calidad',
                moho_encontrado: '25',
                golpes_encontrado: '10',
                frio_encontrado: '8',
                maduracion_encontrado: '5',
                observaciones: 'Producto con múltiples defectos de calidad',
                fecha: new Date('2025-01-15'),
                kilos: 2500,
                cajas: 120
            }
        });

        // Contenedor con calidad excelente
        const contenedorExcelente = generateMockContenedor({
            numeroContenedor: 'EXCELLENT001',
            reclamacionCalidad: {
                cliente: 'Cliente Premium',
                responsable: 'Inspector Junior',
                Cargo: 'Analista de Calidad',
                moho_encontrado: '0',
                golpes_encontrado: '0',
                frio_encontrado: '0',
                maduracion_encontrado: '0',
                observaciones: 'Producto de excelente calidad, sin defectos',
                fecha: new Date('2025-01-20'),
                kilos: 3000,
                cajas: 150
            }
        });

        // Verificaciones para contenedor de mala calidad
        expect(contenedorMalaCalidad.numeroContenedor).toBe('BAD001');
        expect(contenedorMalaCalidad.reclamacionCalidad.moho_encontrado).toBe('25');
        expect(contenedorMalaCalidad.reclamacionCalidad.golpes_encontrado).toBe('10');
        expect(contenedorMalaCalidad.reclamacionCalidad.cliente).toBe('Cliente Insatisfecho');

        // Verificaciones para contenedor excelente
        expect(contenedorExcelente.numeroContenedor).toBe('EXCELLENT001');
        expect(contenedorExcelente.reclamacionCalidad.moho_encontrado).toBe('0');
        expect(contenedorExcelente.reclamacionCalidad.golpes_encontrado).toBe('0');
        expect(contenedorExcelente.reclamacionCalidad.cliente).toBe('Cliente Premium');
    });

    it('debería generar contenedores con datos aleatorios cuando no se especifican overrides', () => {
        const contenedorAleatorio1 = generateMockContenedor();
        const contenedorAleatorio2 = generateMockContenedor();

        // Verificamos que se generan contenedores únicos
        expect(contenedorAleatorio1._id).not.toBe(contenedorAleatorio2._id);
        expect(contenedorAleatorio1.numeroContenedor).not.toBe(contenedorAleatorio2.numeroContenedor);
        
        // Verificamos que tienen la estructura correcta
        expect(contenedorAleatorio1.reclamacionCalidad).toBeDefined();
        expect(contenedorAleatorio1.reclamacionCalidad.cliente).toBeDefined();
        expect(contenedorAleatorio1.reclamacionCalidad.responsable).toBeDefined();
        expect(contenedorAleatorio1.reclamacionCalidad.fecha).toBeDefined();
        
        expect(contenedorAleatorio2.reclamacionCalidad).toBeDefined();
        expect(contenedorAleatorio2.reclamacionCalidad.cliente).toBeDefined();
        expect(contenedorAleatorio2.reclamacionCalidad.responsable).toBeDefined();
        expect(contenedorAleatorio2.reclamacionCalidad.fecha).toBeDefined();
    });    it('debería funcionar con hook mock que devuelve datos específicos', () => {
        // Crear mock data específico usando generateMockContenedor
        const contenedorEspecifico = generateMockContenedor({
            numeroContenedor: 'SPECIFIC123',
            reclamacionCalidad: {
                cliente: 'Cliente Específico',
                responsable: 'Responsable Específico',
                telefono: '3001234567',
                correo: 'especifico@test.com',
                fecha: new Date('2025-06-01')
            }
        });

        // Mockeamos el hook para devolver nuestro contenedor específico
        const mockUseFetchPaginatedList = vi.mocked(useFetchPaginatedList);
        mockUseFetchPaginatedList.mockReturnValue({
            obtenerData: vi.fn(),
            obtenerCantidadElementos: vi.fn(),
            data: [contenedorEspecifico],
            numeroElementos: 1
        });

        render(<ReclamacionesClientes />);

        // Verificamos que se muestra la información específica
        expect(screen.getByText('SPECIFIC123')).toBeInTheDocument();
        expect(screen.getByText('Cliente Específico')).toBeInTheDocument();
        
        // Verificamos que hay exactamente un ícono de información
        const infoIcons = screen.getAllByText('', { selector: 'div[style="color: blue;"]' });
        expect(infoIcons).toHaveLength(1);
    });

    it('debería mostrar contenedores con diferentes tipos de defectos de calidad', () => {
        // Crear contenedores con diferentes niveles de defectos
        const contenedorAltoDefecto = generateMockContenedor({
            _id: 'defecto_alto',
            numeroContenedor: 'DEF001',
            reclamacionCalidad: {
                cliente: 'Cliente con Problemas',
                responsable: 'Inspector Calidad',
                moho_encontrado: '20',
                golpes_encontrado: '15',
                frio_encontrado: '10',
                maduracion_encontrado: '8',
                observaciones: 'Múltiples defectos encontrados',
                fecha: new Date('2025-03-15')
            }
        });

        const contenedorBajoDefecto = generateMockContenedor({
            _id: 'defecto_bajo',
            numeroContenedor: 'DEF002',
            reclamacionCalidad: {
                cliente: 'Cliente Satisfecho',
                responsable: 'Inspector Calidad',
                moho_encontrado: '1',
                golpes_encontrado: '0',
                frio_encontrado: '0',
                maduracion_encontrado: '1',
                observaciones: 'Calidad dentro de parámetros',
                fecha: new Date('2025-03-16')
            }
        });

        const mockUseFetchPaginatedList = vi.mocked(useFetchPaginatedList);
        mockUseFetchPaginatedList.mockReturnValue({
            obtenerData: vi.fn(),
            obtenerCantidadElementos: vi.fn(),
            data: [contenedorAltoDefecto, contenedorBajoDefecto],
            numeroElementos: 2
        });

        render(<ReclamacionesClientes />);

        // Verificamos que ambos contenedores se muestran
        expect(screen.getByText('DEF001')).toBeInTheDocument();
        expect(screen.getByText('DEF002')).toBeInTheDocument();
        expect(screen.getByText('Cliente con Problemas')).toBeInTheDocument();
        expect(screen.getByText('Cliente Satisfecho')).toBeInTheDocument();

        // Verificamos que hay exactamente 2 íconos de información
        const infoIcons = screen.getAllByText('', { selector: 'div[style="color: blue;"]' });
        expect(infoIcons).toHaveLength(2);
    });

    it('debería generar datos aleatorios consistentes con generateMockContenedor', () => {
        // Generar múltiples contenedores aleatorios
        const contenedoresAleatorios = Array.from({ length: 5 }, (_, index) => 
            generateMockContenedor({
                _id: `random_${index}`,
                numeroContenedor: `RAND${index.toString().padStart(3, '0')}`
            })
        );

        // Verificar que cada contenedor tiene las propiedades requeridas
        contenedoresAleatorios.forEach((contenedor, index) => {
            expect(contenedor._id).toBe(`random_${index}`);
            expect(contenedor.numeroContenedor).toBe(`RAND${index.toString().padStart(3, '0')}`);
            expect(contenedor.reclamacionCalidad).toBeDefined();
            expect(contenedor.reclamacionCalidad.cliente).toBeDefined();
            expect(contenedor.reclamacionCalidad.responsable).toBeDefined();
            expect(contenedor.reclamacionCalidad.fecha).toBeDefined();
            expect(contenedor.pallets).toBeDefined();
            expect(Array.isArray(contenedor.pallets)).toBe(true);
            expect(contenedor.pallets.length).toBeGreaterThan(0);
        });

        // Verificar que los datos aleatorios son diferentes entre contenedores
        const clientes = contenedoresAleatorios.map(c => c.reclamacionCalidad.cliente);
        const responsables = contenedoresAleatorios.map(c => c.reclamacionCalidad.responsable);
        
        // Al menos debería haber alguna variación en los datos generados
        expect(new Set(clientes).size).toBeGreaterThan(1);
        expect(new Set(responsables).size).toBeGreaterThan(1);
    });

    it('debería simular escenarios de reclamaciones por temporada', () => {
        // Contenedor de temporada alta (más problemas)
        const contenedorTemporadaAlta = generateMockContenedor({
            numeroContenedor: 'TEMP001',
            reclamacionCalidad: {
                cliente: 'Cliente Temporada Alta',
                responsable: 'Supervisor Temporada',
                Cargo: 'Supervisor Senior',
                moho_encontrado: '12',
                golpes_encontrado: '8',
                observaciones: 'Problemas típicos de temporada alta',
                fecha: new Date('2025-02-15'), // Temporada alta
                kilos: 2800,
                cajas: 140
            },
            infoContenedor: {
                // ...existing properties...
                tipoFruta: 'Limon',
                observaciones: 'Contenedor de temporada alta con mayor demanda'
            }
        });

        // Contenedor de temporada baja (mejor calidad)
        const contenedorTemporadaBaja = generateMockContenedor({
            numeroContenedor: 'TEMP002',
            reclamacionCalidad: {
                cliente: 'Cliente Temporada Baja',
                responsable: 'Inspector Regular',
                Cargo: 'Inspector',
                moho_encontrado: '3',
                golpes_encontrado: '1',
                observaciones: 'Excelente calidad de temporada baja',
                fecha: new Date('2025-07-15'), // Temporada baja
                kilos: 3200,
                cajas: 160
            },
            infoContenedor: {
                // ...existing properties...
                tipoFruta: 'Naranja',
                observaciones: 'Contenedor de temporada baja con mejor calidad'
            }
        });

        // Verificar que los overrides se aplicaron correctamente
        expect(contenedorTemporadaAlta.numeroContenedor).toBe('TEMP001');
        expect(contenedorTemporadaAlta.reclamacionCalidad.moho_encontrado).toBe('12');
        expect(contenedorTemporadaAlta.reclamacionCalidad.kilos).toBe(2800);

        expect(contenedorTemporadaBaja.numeroContenedor).toBe('TEMP002');
        expect(contenedorTemporadaBaja.reclamacionCalidad.moho_encontrado).toBe('3');
        expect(contenedorTemporadaBaja.reclamacionCalidad.kilos).toBe(3200);
    });

    it('debería permitir testing exhaustivo con datos mock complejos', () => {
        // Crear un escenario complejo usando generateMockContenedor
        const contenedorComplejo = generateMockContenedor({
            _id: 'complejo_001',
            numeroContenedor: 'COMPLEX001',
            reclamacionCalidad: {
                cliente: 'Cliente Corporativo Premium',
                responsable: 'Director de Calidad',
                Cargo: 'Director',
                telefono: '3001234567',
                correo: 'calidad@clientepremium.com',
                fechaArribo: '2025-06-01',
                contenedor: 'COMPLEX001',
                kilos: 3500,
                cajas: 175,
                fechaDeteccion: String(new Date('2025-06-02')),
                moho_encontrado: '5',
                moho_permitido: '2',
                golpes_encontrado: '2',
                golpes_permitido: '0',
                frio_encontrado: '1',
                frio_permitido: '0',
                maduracion_encontrado: '3',
                maduracion_permitido: '1',
                otroDefecto: 'Decoloración leve',
                observaciones: 'Reclamación formal por defectos múltiples en contenedor premium',
                archivosSubidos: ['evidencia_1.jpg', 'evidencia_2.jpg', 'informe_tecnico.pdf'],
                fecha: new Date('2025-06-02')
            },
            infoContenedor: {
                clienteInfo: 'Cliente Corporativo Premium',
                fechaCreacion: String(new Date('2025-05-20')),
                fechaInicio: String(new Date('2025-05-21')),
                fechaInicioReal: String(new Date('2025-05-21')),
                fechaFinalizado: String(new Date('2025-05-30')),
                fechaEstimadaCargue: String(new Date('2025-05-30')),
                fechaSalida: String(new Date('2025-05-31')),
                tipoFruta: 'Limon',
                tipoCaja: ['B-16.5'],
                calidad: ['1'],
                sombra: '85%',
                defecto: '7%',
                mancha: '2%',
                verdeManzana: '1%',
                cerrado: true,
                observaciones: 'Contenedor premium con estándares altos de calidad',
                desverdizado: true,
                calibres: ['175', '200'],
                urlInforme: 'https://informes.celifrut.com/COMPLEX001',
                cajasTotal: '175',
                rtoEstimado: '2500 USD'
            }
        });

        // Verificar que todos los datos complejos se aplicaron correctamente
        expect(contenedorComplejo.numeroContenedor).toBe('COMPLEX001');
        expect(contenedorComplejo.reclamacionCalidad.cliente).toBe('Cliente Corporativo Premium');
        expect(contenedorComplejo.reclamacionCalidad.kilos).toBe(3500);
        expect(contenedorComplejo.reclamacionCalidad.cajas).toBe(175);
        expect(contenedorComplejo.reclamacionCalidad.moho_encontrado).toBe('5');
        expect(contenedorComplejo.reclamacionCalidad.archivosSubidos).toHaveLength(3);
        expect(contenedorComplejo.infoContenedor.cerrado).toBe(true);
        expect(contenedorComplejo.infoContenedor.desverdizado).toBe(true);
        expect(contenedorComplejo.infoContenedor.calibres).toEqual(['175', '200']);

        // Verificar que mantiene las propiedades generadas automáticamente
        expect(contenedorComplejo.pallets).toBeDefined();
        expect(Array.isArray(contenedorComplejo.pallets)).toBe(true);
        expect(contenedorComplejo.pallets.length).toBeGreaterThan(0);
        expect(contenedorComplejo.infoTractoMula).toBeDefined();
        expect(contenedorComplejo.infoExportacion).toBeDefined();
        expect(contenedorComplejo.insumosData).toBeDefined();
        expect(contenedorComplejo.inspeccion_mula).toBeDefined();

        // Test con el componente usando este contenedor complejo
        const mockUseFetchPaginatedList = vi.mocked(useFetchPaginatedList);
        mockUseFetchPaginatedList.mockReturnValue({
            obtenerData: vi.fn(),
            obtenerCantidadElementos: vi.fn(),
            data: [contenedorComplejo],
            numeroElementos: 1
        });

        render(<ReclamacionesClientes />);

        // Verificar que se renderiza correctamente
        expect(screen.getByText('COMPLEX001')).toBeInTheDocument();
        expect(screen.getByText('Cliente Corporativo Premium')).toBeInTheDocument();

        // Verificar interacción del modal
        const infoIcon = screen.getByText('', { selector: 'div[style="color: blue;"]' });
        fireEvent.click(infoIcon);
        expect(screen.getByTestId('modal-reclamaciones')).toBeInTheDocument();
    });
});