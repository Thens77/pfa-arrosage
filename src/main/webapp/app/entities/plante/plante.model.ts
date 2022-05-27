import { ITypePlante } from 'app/entities/type-plante/type-plante.model';

export interface IPlante {
  id?: number;
  libelle?: string | null;
  photoContentType?: string | null;
  photo?: string | null;
  typeplante?: ITypePlante | null;
}

export class Plante implements IPlante {
  constructor(
    public id?: number,
    public libelle?: string | null,
    public photoContentType?: string | null,
    public photo?: string | null,
    public typeplante?: ITypePlante | null
  ) {}
}

export function getPlanteIdentifier(plante: IPlante): number | undefined {
  return plante.id;
}
