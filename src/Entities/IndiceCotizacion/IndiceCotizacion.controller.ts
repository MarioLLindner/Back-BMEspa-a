import { Controller, Get, HttpException, HttpStatus, Logger, Param } from '@nestjs/common';
import { CotizacionIndiceService } from './IndiceCotizacion.service';
import { IndicesService } from '../Indice/indices.services';
import { CotizacionIndice } from './IndiceCotizacion.entity';

@Controller('cotizacionIndice')
export class CotizacionIndiceController {
    constructor(
        private readonly cotizacionIndiceService: CotizacionIndiceService,
        private readonly indiceService: IndicesService,
    ) { }

    private readonly logger = new Logger(CotizacionIndiceController.name);

    @Get('/actualizarDatosIndice')
    async actualizarCotizacionesIndicesDesdeGempresa() {
        try {
            await this.cotizacionIndiceService.actualizarCotizacionesMisIndices();
            return { message: "Cotizaciones Actualizadas" };
        } catch (error) {
            this.logger.error(`Error al actualizar cotizaciones de índices: ${error.message}`);
            throw new HttpException('Error al actualizar cotizaciones de índices', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/obtenerCotizaciones')
    async obtenerCotizaciones(): Promise<CotizacionIndice[]> {
        try {
            this.logger.debug("ObetenerCotizaciones",this.cotizacionIndiceService.obtenerTodasLasCotizaciones())
            return await this.cotizacionIndiceService.obtenerTodasLasCotizaciones();
        } catch (error) {
            this.logger.error(`Error al obtener cotizaciones de índices: ${error.message}`);
            throw new HttpException('Error al obtener cotizaciones de índices', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/test')
    async test() {
        const data= await this.cotizacionIndiceService.calcularIndice();
        return data
    }

    @Get('/filtrarCotdemiDB/:codigoIndice')
    public async GetFiltrarCotIndices(@Param('codigoIndice') codigoIndice: string): Promise<{ cotizacion: number; fecha: string; hora: string; id: number }[]> {
      console.log("Filtrado de cotizaciones de mi DB por codigoIndice")
      console.log(this.cotizacionIndiceService.GetFiltrarCotIndices(codigoIndice))
      return await this.cotizacionIndiceService.GetFiltrarCotIndices(codigoIndice)
    }

    @Get('/BuscarMisIndices')
    public async GetBuscarIndices(): Promise<string[]> {
      const Indices = await this.indiceService.buscarMisIndicesDeDB();
      console.log(Indices)
      return Indices
    }  
}


