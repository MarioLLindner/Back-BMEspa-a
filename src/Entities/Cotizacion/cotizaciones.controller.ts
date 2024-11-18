import { Body, Controller, Get, Param, Query, Logger } from "@nestjs/common";
import { CotizacionesService } from "src/Entities/Cotizacion/cotizaciones.services";
import { Cotizacion } from "./cotizacion.entity";
import { EmpresasService } from "../Empresa/empresas.services";

@Controller('/cotizaciones')
export class CotizacionesController {
  constructor(
    private cotizacionesService: CotizacionesService,
    private empresaService: EmpresasService,
  ) { }
  private readonly logger = new Logger(CotizacionesController.name);

  //Trae todas las cotizaciones guardadas en mi DB Local
  //Postman: http://localhost:8080/cotizaciones/
  @Get()
  public getCotizaciones(): Promise<Cotizacion[]> {
    this.logger.log("CC - Obteniendo todas las cotizaciones");
    return this.cotizacionesService.getCotizaciones();
  }

  //UTC
  //Formato 2024-11-14T00:00 (YYYY-MM-DDTHH:MM)
  //http://localhost:8080/cotizaciones/entreFechas/V?fechaDesde=2024-01-01T01:00&fechaHasta=2024-01-02T10:00
  @Get('/entreFechas/:codEmpresa')
  public getCotizacionesEntreFechas(
    @Param('codEmpresa') codEmpresa: string,
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string): Promise<Cotizacion[]> {
    this.logger.log(`CC - Obteniendo cotizaciones desde Gempresa de la empresa ${codEmpresa} entre ${fechaDesde} y ${fechaHasta}`);


    return this.cotizacionesService.getCotizacionesEntreFechas(codEmpresa, fechaDesde, fechaHasta);
  }

  //UTC
  //http://localhost:8080/cotizaciones/fechayhora/V?fecha=2024-01-01&hora=08:00
  @Get('fechayhora/:codEmpresa')
  public getCotizacionesFechaYHora(
    @Param('codEmpresa') codEmpresa: string,
    @Query('fecha') fecha: string,
    @Query('hora') hora: string): Promise<Cotizacion[]> {
    this.logger.log(`CC - Obteniendo cotizacion de la empresa ${codEmpresa} el dia ${fecha} a la hora ${hora}`);
    return this.cotizacionesService.getCotizacionesFechaYHora(codEmpresa, fecha, hora);
  }



  //http://localhost:8080/cotizaciones/traerCotizacionesMisEmpresas
  @Get('/traerCotizacionesMisEmpresas')
  public async actualizarCotizacionesMisEmpresas(): Promise<void> {
  
    const arrCodigosEmpresas = /* ["AAPL","KO","JPM"] */await this.empresaService.buscarMisEmpresasDeDB();
    if (arrCodigosEmpresas && arrCodigosEmpresas.length > 0) {
      for (const codEmpresa of arrCodigosEmpresas) {
        try {
          await this.cotizacionesService.guardarTodasLasCotizaciones(codEmpresa);
        } catch (error) {
          this.logger.error(`Error al actualizar cotizaciones para la empresa ${codEmpresa}: ${error.message}`);
        }
      }
    } else {
      this.logger.error("No hay empresas en su DB Local o la búsqueda falló");
    }
  }
  
}