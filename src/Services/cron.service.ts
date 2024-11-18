import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CotizacionesService } from 'src/Entities/Cotizacion/cotizaciones.services';
import { EmpresasService } from 'src/Entities/Empresa/empresas.services';



@Injectable()
export class GenDataService {
  private readonly logger = new Logger(GenDataService.name);
  constructor(
    private readonly cotizacionesService: CotizacionesService,
    private readonly empresasService: EmpresasService,
    
    ) {
    this.logger.log('Servicio Gen Data Inicializado');
  }


  @Cron('1 0 * * * *')

  async getLastCotizaciones() {

    const CodigosEmpresas = await this.empresasService.buscarMisEmpresasDeDB();
  
    for (const codigo of CodigosEmpresas) {
      this.cotizacionesService.guardarTodasLasCotizaciones(codigo);
    }
    //this.cotizacionControler.getLastCotizacion()
  }


  @Cron('1 5 * * * *')
  postIndiceCotizacion() {
    this.logger.log('Ejecución del cron postIndiceCotizacion:', new Date().toISOString());
  }

  @Cron('1 10 * * * *')
  getIndiceCotizaciones() {
    this.logger.log('Ejecución del cron getIndiceCotizaciones : ', new Date().toISOString());
  }


}
