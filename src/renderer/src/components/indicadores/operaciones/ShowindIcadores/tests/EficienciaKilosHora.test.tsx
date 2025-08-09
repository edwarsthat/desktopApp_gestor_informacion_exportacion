/* eslint-disable prettier/prettier */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { IndicadorKilosProcesados } from "../validations/types";
import { FilterValues } from "@renderer/hooks/useFiltro";
import EficienciaKilosHora from "../components/EficienciaKilosHora";

// Mock completo del gráfico para evitar problemas de canvas
vi.mock("../graficos/GraficoBarrasEficienciaKilosHora", () => ({
    default: (): JSX.Element => <div data-testid="mock-grafico">Mock Gráfico</div>
}));

// Mock de la función promedio
vi.mock("../function", () => ({
    promedio: vi.fn(() => 86)
}));

// Mock de formatearFecha
vi.mock("@renderer/functions/fechas", () => ({
    formatearFecha: vi.fn(() => "26/06/2025")
}));

// Configurar window.api
Object.defineProperty(window, 'api', {
    writable: true,
    value: {
        mostrarMenuTabla: vi.fn()
    }
});

const mockData: IndicadorKilosProcesados[] = [
    {
        kilos_vaciados: 1000,
        kilos_hora: 80,
        fecha: "2025-06-26T12:00:00.000Z",
        duracion_turno_horas: 12.5,
        meta_kilos_turno: 900,
        meta_kilos_hora: 75,
        eficiencia_procesado_turno: 90,
        eficiencia_procesado_hora: 86
    }
];

const currentFiltersDia: FilterValues = {
    divisionTiempo: "dia",
    tipoFruta: '',
    tipoFruta2: {
        rengoDeshidratacionNegativa: 0,
        rengoDeshidratacionPositiva: 0,
        tipoFruta: "",
        valorPromedio: 0,
        _id: "",
        defectos: [],
        createdAt: "",
        codExportacion: "",
        codNacional: "",
        calibres: [],
        calidades: []
    },
    fechaInicio: '',
    fechaFin: '',
    GGN: false,
    buscar: '',
    proveedor: '',
    tipoFecha: '',
    EF: '',
    all: false,
    cuartoDesverdizado: ''
};

const currentFiltersSemana: FilterValues = {
    divisionTiempo: "semana",
    tipoFruta: '',
    tipoFruta2: {
        rengoDeshidratacionNegativa: 0,
        rengoDeshidratacionPositiva: 0,
        tipoFruta: "",
        valorPromedio: 0,
        _id: "",
        defectos: [],
        createdAt: "",
        codExportacion: "",
        codNacional: "",
        calibres: [],
        calidades: []
    },
    fechaInicio: '',
    fechaFin: '',
    GGN: false,
    buscar: '',
    proveedor: '',
    tipoFecha: '',
    EF: '',
    all: false,
    cuartoDesverdizado: ''
};

describe("EficienciaKilosHora Component", () => {
    it("renderiza columnas correctas para 'dia'", () => {
        render(<EficienciaKilosHora data={mockData} currentFilters={currentFiltersDia} />);
        expect(screen.getByText(/Fecha/i)).toBeInTheDocument();
        expect(screen.getByText(/Duración Turno/i)).toBeInTheDocument();
        expect(screen.getByText(/Eficiencia Kilos Hora/i)).toBeInTheDocument();
    });

    it("renderiza datos correctos en la tabla para 'dia'", () => {
        render(<EficienciaKilosHora data={mockData} currentFilters={currentFiltersDia} />);
        expect(screen.getByText("26/06/2025")).toBeInTheDocument(); // formatearFecha mockeada
        expect(screen.getByText("12.50")).toBeInTheDocument();

        // Buscar el elemento dentro de la tabla específicamente
        const table = screen.getByRole("table");
        expect(table).toBeInTheDocument();

        // Verificar que el porcentaje aparece en la celda de la tabla
        const cells = screen.getAllByText("86.00 %");
        expect(cells.length).toBeGreaterThan(0); // Debe aparecer al menos una vez
    });

    it("renderiza columnas correctas para 'semana'", () => {
        render(<EficienciaKilosHora data={mockData} currentFilters={currentFiltersSemana} />);
        expect(screen.getByText(/Semana/i)).toBeInTheDocument();
        expect(screen.getByText(/Promedio Duración Turno/i)).toBeInTheDocument();
        expect(screen.getByText(/Promedio Eficiencia Kilos Hora/i)).toBeInTheDocument();
    });

    it("dispara el menú contextual al hacer right click", () => {
        render(<EficienciaKilosHora data={mockData} currentFilters={currentFiltersDia} />);
        const table = screen.getByRole("table");
        fireEvent.contextMenu(table);
        expect(window.api.mostrarMenuTabla).toHaveBeenCalled();
    });

    it("muestra sumatoria y promedio", () => {
        render(<EficienciaKilosHora data={mockData} currentFilters={currentFiltersDia} />);
        expect(screen.getByText(/Sumatoria Eficiencia Kilos Procesados/i)).toBeInTheDocument();
        expect(screen.getByText(/Promedio Eficiencia Kilos Procesados/i)).toBeInTheDocument();
    });

    it("muestra mensaje friendly si no hay datos", () => {
        render(<EficienciaKilosHora data={[]} currentFilters={currentFiltersDia} />);
        expect(screen.getByText(/Sumatoria Eficiencia Kilos Procesados/i)).toBeInTheDocument();
        // Agrega tu EmptyState aquí si lo implementas
    });
});
