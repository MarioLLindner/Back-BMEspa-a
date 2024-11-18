import { Module } from '@nestjs/common';
import { IndiceService } from './indices.services';
import { IndiceController } from './indices.controller';
import { Indice } from './indice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Indice])],
  controllers: [IndiceController],
  providers: [IndiceService],
})
export class IndiceModule {}
