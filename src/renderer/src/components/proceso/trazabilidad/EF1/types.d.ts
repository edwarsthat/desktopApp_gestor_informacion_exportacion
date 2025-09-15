/* eslint-disable prettier/prettier */


export interface Change {
    field: string;
    before: unknown;
    after: unknown;
}

interface NewValue {
    kilos?: number;
    canastillas?: number;
}

export interface AuditLog {
    _id: string;
    coleccion: string;
    documentId: string;
    operation: string;
    user: string;
    action: string;
    timestamp: Date;
    oldValue?: unknown;
    newValue?: NewValue;
    changes?: Change[];
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
