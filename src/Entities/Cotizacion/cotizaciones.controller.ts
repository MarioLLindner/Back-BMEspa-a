import { Body, ConsoleLogger, Controller, Get, Param, Query } from "@nestjs/common";
import { CotizacionesService } from "src/Entities/Cotizacion/cotizaciones.services";
import { Cotizacion } from "./cotizacion.entity";
import { EmpresasService } from "../Empresa/empresas.services";

@Controller('/cotizaciones')
export class CotizacionesController {
  constructor(private cotizacionesService: CotizacionesService, private empresaService: EmpresasService) { }


  //controlado
  @Get()
  public getCotizaciones(): Promise <Cotizacion[]> {
    console.log("Cotizaciones back");
    return this.cotizacionesService.getCotizaciones();
  }


  //controlado
  @Get('/UTC/:codEmpresa')
  public getCotizacionesUTCByEmpresaEntreFechas(
    @Param('codEmpresa') codEmpresa: string,
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string): Promise <Cotizacion[]> {
    console.log("Cotizaciones back");
    return this.cotizacionesService.getCotizacionesByEmpresaEntreFechas(codEmpresa, fechaDesde, fechaHasta);
  }

// COTEJAR CON KEVIN
  @Get('/:codEmpresa/cotizacion')
  public getCotizacionesUTCFechaYHora(
    @Param('codEmpresa') codEmpresa: string,
    @Query('fecha') fecha: string,
    @Query('hora') hora: string): Promise <Cotizacion[]> {
      console.log("Cotizaciones back");
      return this.cotizacionesService.getCotizacionesFechaYHora(codEmpresa, fecha, hora);
    }
    
    
    
    
    //Obtengo todas las cotizaciones de Gempresa y las Guardo en mi DB
    @Get('/traerCotizaciones/cot')
    public async getAllCotizaciones(): Promise<void> {
      const arrCodigosEmpresas = await this.empresaService.buscarMisCodEmpresas();
      for (const codEmpresa of arrCodigosEmpresas) {
        await this.cotizacionesService.guardarCotizaciones(codEmpresa);
      }
    }
    
    //Filtro en mi DB las Cotizaciones por Empresa
    @Get('/filtrarCotdemiDB/:codEmpresa')
    public async GetFiltrarCot(@Param('codEmpresa') codEmpresa: string): Promise<Cotizacion[]> {
      console.log("Filtrado de cotizaciones de mi DB por codEmpresa")
      return this.cotizacionesService.getFiltrarCotizaciones(codEmpresa)
    }
  }
  
  
  /*   @Get('/:codEmpresa')
    public getCotizacionesByEmpresaEntreFechas(
      @Param('codEmpresa') codEmpresa: string,
      @Query('fechaDesde') fechaDesde: string,
      @Query('fechaHasta') fechaHasta: string): Promise <Cotizacion[]> {
      console.log("Cotizaciones back");
      return this.cotizacionesService.getCotizacionesByEmpresaEntreFechas(codEmpresa, fechaDesde, fechaHasta);
    } */

