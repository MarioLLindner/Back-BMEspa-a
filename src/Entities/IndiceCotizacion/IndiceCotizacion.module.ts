import { Module } from '@nestjs/common';
import { indiceCotizacionController } from './indiceCotizacion.controller';
import { IndiceCotizacion } from './indiceCotizacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndiceCotizacionService } from './indiceCotizacion.service';
import { Cotizacion } from '../Cotizacion/cotizacion.entity';
import { Indice } from '../Indice/indice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndiceCotizacion,Cotizacion,Indice])],
  controllers: [indiceCotizacionController],
  providers: [IndiceCotizacionService],
})
export class IndiceCotizacionModule {}
