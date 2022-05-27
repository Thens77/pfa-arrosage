import dayjs from 'dayjs/esm';
import { IZone } from 'app/entities/zone/zone.model';

export interface IGrandeur {
  id?: number;
  type?: string | null;
  valeur?: string | null;
  date?: dayjs.Dayjs | null;
  zone?: IZone | null;
}

export class Grandeur implements IGrandeur {
  constructor(
    public id?: number,
    public type?: string | null,
    public valeur?: string | null,
    public date?: dayjs.Dayjs | null,
    public zone?: IZone | null
  ) {}
}

export function getGrandeurIdentifier(grandeur: IGrandeur): number | undefined {
  return grandeur.id;
}
