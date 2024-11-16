import * as momentTZ from 'moment-timezone';
import { IFecha } from 'src/Model/fecha.model';

class DateMomentsUtils {
  static TZ: string = "Europe/Madrid";
  static horarioDeBolsa = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
  ];

  static formatearFecha(fecha: IFecha): string {
    return `${fecha.fecha}T${fecha.hora}`;
  };

  static getUltimaFechaCotizacionGempresa(): IFecha {
    const fecha = new Date();
    fecha.setMinutes(0);

    const fechaISO = fecha.toISOString();
    const horaTZ = momentTZ.tz(`${fecha}`, DateMomentsUtils.TZ);

    const fechaString = horaTZ.format();

    return {
      fecha: fechaString.substring(0, 10),
      hora: fechaString.substring(11, 16)
    };
  };

  static transformarFechaAGMT(fecha: string, hora: string): IFecha {
    const fechaUTC = new Date(`${fecha}T${hora}:00.000Z`);
    const horaTZ = momentTZ.tz(fechaUTC, DateMomentsUtils.TZ);
    const fechaString = horaTZ.format();

    const fechaGMT = {
      fecha: fechaString.substring(0, 10),
      hora: fechaString.substring(11, 16)
    }
    return fechaGMT;
  };
}
export default DateMomentsUtils;

