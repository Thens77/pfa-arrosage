import dayjs from 'dayjs/esm';
import { IPlante } from 'app/entities/plante/plante.model';
import { IZone } from 'app/entities/zone/zone.model';

export interface IPlantation {
  id?: number;
  date?: dayjs.Dayjs | null;
  nbrPlante?: number | null;
  plante?: IPlante | null;
  zone?: IZone | null;
}

export class Plantation implements IPlantation {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public nbrPlante?: number | null,
    public plante?: IPlante | null,
    public zone?: IZone | null
  ) {}
}

export function getPlantationIdentifier(plantation: IPlantation): number | undefined {
  return plantation.id;
}
