import { Injectable, Logger } from '@nestjs/common';
import { Cotizacion } from './cotizacion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosResponse } from 'axios';
import { baseURL } from 'src/Services/AxiosAGempresa';
import DateMomentsUtils from 'src/utils/dateutils';
import { IFecha } from 'src/Model/Fecha.model';
import { Empresa } from '../Empresa/empresa.entity';

@Injectable()
export class CotizacionesService {
  constructor(
    @InjectRepository(Cotizacion) private readonly cotizacionRepository: Repository<Cotizacion>,
    @InjectRepository(Empresa) private readonly empresaRepository: Repository<Empresa>,
  ) { }

  // Obtener todas las cotizaciones guardadas en la base de datos local
  public async getCotizaciones(): Promise<Cotizacion[]> {
    return this.cotizacionRepository.find();
  }

  // Obtener cotizaciones de una empresa entre fechas específicas
  public async getCotizacionesEntreFechas(codEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<Cotizacion[]> {
    const empresa = await this.empresaRepository.findOne({ where: { codEmpresa } });
    const fechaDesdeUTC = DateMomentsUtils.transformarFechaAGMT(fechaDesde.split("T")[0], fechaDesde.split("T")[1]);
    const fechaHastaUTC = DateMomentsUtils.transformarFechaAGMT(fechaHasta.split("T")[0], fechaHasta.split("T")[1]);
    if (!empresa) {
      console.error("CS - La empresa ingresada no existe en la base de datos local.");
      return [];
    }
    const respuestaGempresa = await axios.get(`${baseURL}/empresas/${codEmpresa}/cotizaciones?fechaDesde=${fechaDesdeUTC.fecha}T${fechaDesdeUTC.hora}&fechaHasta=${fechaHastaUTC.fecha}T${fechaHastaUTC.hora}`);
    const cotizaciones = respuestaGempresa.data.map(cotizacion => {
      const fechaLocal = DateMomentsUtils.transformarFechaAGMT(cotizacion.fecha, cotizacion.hora);
      return new Cotizacion(cotizacion.id, fechaLocal.fecha, fechaLocal.hora, cotizacion.cotization, empresa);
    });
    await this.cotizacionRepository.save(cotizaciones);
    return cotizaciones;
  }

  // Obtener cotización específica de una empresa por fecha y hora
  public async getCotizacionesFechaYHora(codEmpresa: string, fecha: string, hora: string): Promise<Cotizacion[]> {
    try {
      const cotizacion = await this.cotizacionRepository.findOne({
        relations: ['codEmpresaFK'],
        where: {
          codEmpresaFK: { codEmpresa },
          fecha,
          hora
        }
      });

      if (cotizacion) {
        return [cotizacion];
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(`No se pudo obtener la cotización para la empresa ${codEmpresa}`);
    }
  }

  public async guardarTodasLasCotizaciones(codEmpresa: string): Promise<void> {
    const ultimaFechaEnMiDB = await this.ultimaFechaDeCotizacionEnMiDB(codEmpresa);
    const stringUltimaFechaEnMiDB = DateMomentsUtils.formatearFecha(ultimaFechaEnMiDB);
    const ultimaFechaGempresa = await this.ultimaFechaRegistradaEnGempresa();
    const stringUltimaFechaDeGempresa = DateMomentsUtils.formatearFecha(ultimaFechaGempresa);
    try {
      const cotizaciones = await this.getCotizacionesDeGempresaConCodEmpresaYFechasEnGMT(
        codEmpresa,
        stringUltimaFechaEnMiDB,
        stringUltimaFechaDeGempresa,
      );

      console.log(`Cotizaciones procesadas para ${codEmpresa}: ${cotizaciones.length}`);
    } catch (error) {
      throw new error(`Error al guardar cotizaciones para ${codEmpresa}: ${error.message}`);
    }
  }

  // Obtener la última fecha de cotización registrada en Gempresa
  public async ultimaFechaRegistradaEnGempresa(): Promise<IFecha> {
    return DateMomentsUtils.getUltimaFechaCotizacionGempresa();
  }

  // Obtener la última fecha de cotización registrada en la base de datos local
  public async ultimaFechaDeCotizacionEnMiDB(codEmpresa: string): Promise<IFecha> {
    try {
      console.log('Buscando última cotización para codEmpresa:', codEmpresa);
      const empresa = await this.empresaRepository.findOne({ where: { codEmpresa } });

      const ultimaCotizacion = await this.cotizacionRepository.find({
        relations: ['codEmpresaFK'],
        where: { codEmpresaFK: { codEmpresa } },
        order: { id: 'DESC' },
        take: 1,
      });

      const fechaCotizacion = ultimaCotizacion[0];
      if (!fechaCotizacion || !fechaCotizacion.fecha) {
        return DateMomentsUtils.transformarFechaAGMT('2024-01-01', '00:00');
      } else {
        return DateMomentsUtils.transformarFechaAGMT(fechaCotizacion.fecha, fechaCotizacion.hora);
      }
    } catch (error) {
      console.log("Error al buscar la última cotización:", error);
      throw error;
    }
  }

  // Guardar una cotización en la base de datos
  public async guardarCotizacionEnDB(cotizacion: Cotizacion): Promise<Cotizacion> {
    try {
      const hayCotizacion = await this.buscarCotizacionPorID(cotizacion.id);
      if (!hayCotizacion) {
        return this.cotizacionRepository.save(cotizacion);
      } else {
        console.log("La cotización ya existe en la base de datos");
      }
    } catch (error) {
      console.log("Error guardando la cotización:", error);
      throw error;
    }
  }

  // Buscar cotización por ID
  public async buscarCotizacionPorID(cotizacionID: number): Promise<Cotizacion> {
    try {
      return this.cotizacionRepository.findOne({ where: { id: cotizacionID } });
    } catch (error) {
      console.log("Error buscando cotización:", error);
      throw error;
    }
  }

  // Obtener cotizaciones de Gempresa con codEmpresa y fechas en GMT
  public async getCotizacionesDeGempresaConCodEmpresaYFechasEnGMT(codEmpresa: string, stringUltimaFechaEnMiDB: string, stringUltimaFechaDeGempresa: string): Promise<Cotizacion[]> {
    const empresa = await this.empresaRepository.findOne({ where: { codEmpresa } });
    const respuesta: AxiosResponse<any, any> = await axios.get(`${baseURL}/empresas/${codEmpresa}/cotizaciones?fechaDesde=${stringUltimaFechaEnMiDB}&fechaHasta=${stringUltimaFechaDeGempresa}`);
    const horarioDeBolsaUTC = DateMomentsUtils.getHorarioDeBolsaUTC();
    const cotizacionesFaltantes = await Promise.all(respuesta.data.map(async (cotizacion) => {
      const fechaUTC = DateMomentsUtils.transformarFechaAGMT(cotizacion.fecha, cotizacion.hora);
      const valorCotizacion = Number(cotizacion.cotization);
      if (isNaN(valorCotizacion)) {
        console.log(`Valor de cotización no válido: ${cotizacion.cotization}`);
        return;
      }
      if (horarioDeBolsaUTC.includes(fechaUTC.hora)) {
        const nuevaCotizacion = new Cotizacion(
          cotizacion.id,
          fechaUTC.fecha,
          fechaUTC.hora,
          valorCotizacion,
          empresa
        );
        console.log(`Guardando cotización: ${JSON.stringify(nuevaCotizacion)}`);
        await this.guardarCotizacionEnDB(nuevaCotizacion);
      } else {
        console.log(`Cotización fuera de horario: ${JSON.stringify(fechaUTC)}`);
      }
    }));
    await Promise.all(cotizacionesFaltantes);
    return respuesta.data;
  }

  public async obtenerTodasLasCotizaciones(): Promise<Cotizacion[]> {
    try {
      return this.cotizacionRepository.find();
    }
    catch (error) {
      console.log("Error obteniendo todas las cotizaciones:", error);
      throw error;
    }
  }

  public async getFiltrarCotizaciones(codEmpresa: string): Promise<{ cotizacion: number; fecha: string; hora: string; id: number }[]> {
    try {
      const cotizacionesEmpresa = await this.cotizacionRepository.find({
        relations: ['codEmpresaFK'], // Relación a incluir
        where: {
          codEmpresaFK: {
            codEmpresa: codEmpresa, // Aquí 'id' se debe reemplazar por el nombre de la columna de `Empresa` que corresponde a `codEmpresa`
          },
        }
      });

      const cotizacionesFiltradas = cotizacionesEmpresa.map(cotizacion => ({
        cotizacion: cotizacion.cotizacion,
        fecha: cotizacion.fecha,
        hora: cotizacion.hora,
        id: cotizacion.id
      }));

      console.log("console log service", cotizacionesFiltradas)
      return cotizacionesFiltradas
    } catch (error) {
      console.error("Error al filtrar cotizaciones por codEmpresa: ", error);
      throw new Error("No se pudo obtener las cotizaciones");
    }
  }
}