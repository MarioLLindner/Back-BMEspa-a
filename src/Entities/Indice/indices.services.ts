import { Injectable } from '@nestjs/common';
import { Indice } from './indice.entity';
import clienteAxios, { AxiosResponse } from 'axios';
import { baseURL } from 'src/services/AxiosAGempresa';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFecha } from 'src/model/fecha.model';
import DateMomentUtils from 'src/utils/dateUtils';

@Injectable()
export class IndiceService {
  constructor(@InjectRepository(Indice) private readonly indiceRepository: Repository<Indice>){}
  
  async createIndice(body):Promise<void>{
    try {
      await clienteAxios.post(`${baseURL}/indices`, body)
    } catch (error) {
      console.error('El indice ya existe', 409)
    }
    
  }

  async findIndiceByCod(code: string): Promise<Indice> {
    try {
      const indiceCotizacion:Indice = await this.indiceRepository.findOne({
        where: { codeIndice: code },
      })
      console.log('indiceCotizacion:',indiceCotizacion)
      return indiceCotizacion
    } catch (error) {
      console.error("Error buscando indice Cotizacion:", error);
      throw error;
    }
  }

  public async saveAllIndicesDb(): Promise<Indice[]> {
    const respuesta: AxiosResponse<any, any> = await clienteAxios.get(`${baseURL}/indices`);
    console.log('respuesta.data:',respuesta.data)  
    const promesasGuardado = respuesta.data.map(async (indice) => {
        if (await this.findIndiceByCod(indice.code) == null) {
          console.log('indice.data:',indice)  
          const newIndice = new Indice(
            indice.id,
            indice.code,
            indice.name,
            indice.__v,
          );
          console.log('newIndice:',newIndice)  
          await this.indiceRepository.save(newIndice);
          return newIndice
        }else{
          console.log(`El indice code: ${indice.code} ya existe en la db`)
        }
      }
      );
  
      await Promise.all(promesasGuardado);
    return respuesta.data;
}

}