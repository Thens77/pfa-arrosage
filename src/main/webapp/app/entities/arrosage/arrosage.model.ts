import dayjs from 'dayjs/esm';
import { IZone } from 'app/entities/zone/zone.model';

export interface IArrosage {
  id?: number;
  date?: dayjs.Dayjs | null;
  duree?: number | null;
  quantiteEau?: number | null;
  zone?: IZone | null;
}

export class Arrosage implements IArrosage {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public duree?: number | null,
    public quantiteEau?: number | null,
    public zone?: IZone | null
  ) {}
}

export function getArrosageIdentifier(arrosage: IArrosage): number | undefined {
  return arrosage.id;
}
