import { Controller, Get, Query, Logger, Post, Param } from "@nestjs/common";
import { IndicesService } from "./indices.services";
import { Indice } from "./indice.entity";

@Controller('indices')
export class IndicesController {
  constructor(private readonly indicesService: IndicesService) {}

  private readonly logger = new Logger(IndicesController.name);


  //IMPORTANTE
  //Postman: http://localhost:8080/indices/
  //Esto llevarlo a CRON para que automaticamente se busquen todos los indices de GEMPRESA y se guarden en mi DB Local
  @Get()
  public async actualizarIndicesDesdeGempresa(): Promise<void> {
    this.logger.log("IC - Obteniendo todos los índices");
    return this.indicesService.actualizarIndicesDesdeGempresa();
  }


  @Get('/Detalles/:codigoIndice')
  public async ObtenerDetallesDeIndices(@Param('codigoIndice') codigoIndice: string): Promise<any> {
    return this.indicesService.ObtenerDetallesDeIndices(codigoIndice);
  }


  @Get('/test2')
  async test2() {
      const data= await this.indicesService.actualizarIndicesDesdeGempresa();
      return data
  }
}
