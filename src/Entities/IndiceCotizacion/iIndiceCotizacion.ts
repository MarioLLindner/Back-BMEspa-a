// este para crear un indice
export class Iindice {
    code: string;
    name: string;
  }
  
  //este el para subir a gempresa 
  export interface IindiceCotizacion {
    fecha: string;
    hora: string;
    codigoIndice: string;
    valorIndice: number;
  }