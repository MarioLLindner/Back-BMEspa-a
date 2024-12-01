import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicesController } from './indices.controller';
import { Indice } from './indice.entity';
import { CotizacionIndice } from '../IndiceCotizacion/IndiceCotizacion.entity';
import { IndicesService } from './indices.services';


@Module({
  imports: [TypeOrmModule.forFeature([Indice, CotizacionIndice])],
  controllers: [IndicesController],
  providers: [IndicesService],
  exports: [IndicesService, TypeOrmModule]
})
export class IndicesModule {}
