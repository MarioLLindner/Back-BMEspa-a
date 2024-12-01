export interface ICotizacion {
    id?: number;
    fecha: string;
    hora: string;
    dateUTC: Date;
    cotizacion: number;
    idEmpresa: number;
}

export interface CotizacionFront {
    fecha: string;
    hora: string;
    idEmpresa: number;
    cotizacion: number;
}