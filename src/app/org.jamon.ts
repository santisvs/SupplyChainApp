import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.jamon{
   export enum ColorBridaJamon {
      NEGRA,
      ROJA,
      VERDE,
      BLANCA,
   }
   export enum Divisa {
      EURO,
      DOLAR,
   }
   export class Direccion {
      lineaDireccion1: string;
      lineaDireccion2: string;
      localidad: string;
      codigoPostal: string;
   }
   export class Dinero {
      cantidad: string;
      divisa: Divisa;
   }
   export abstract class Individuo extends Participant {
      id: string;
      nombre: string;
      email: string;
      direccion: Direccion;
      contabilidad: Dinero;
   }
   export class Ganadero extends Individuo {
      numeroLicencia: string;
   }
   export class PropietarioRestaurante extends Individuo {
      nombreRestaurante: string;
   }
   export class Jamon extends Asset {
      jamonId: string;
      precio: Dinero;
      peso: number;
      estatus_brida: ColorBridaJamon;
      tiempoCuracion: Date;
      propietario: Individuo;
   }
   export class VenderJamon extends Transaction {
      jamon: Jamon;
      ganadero: Ganadero;
      propietarioRestaurante: PropietarioRestaurante;
   }
   export class VentaDeJamonNotificacion extends Event {
      jamonId: string;
      precio: Dinero;
      nombreRestaurante: string;
      contabilidadRestaurante: Dinero;
      numeroLicenciaGanadero: string;
      contabilidadGanadero: Dinero;
   }
// }
