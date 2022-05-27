import { IZone } from 'app/entities/zone/zone.model';
import { IUser } from 'app/entities/user/user.model';

export interface IEspaceVert {
  id?: number;
  libelle?: string | null;
  photoContentType?: string | null;
  photo?: string | null;
  zones?: IZone[] | null;
  user?: IUser | null;
}

export class EspaceVert implements IEspaceVert {
  constructor(
    public id?: number,
    public libelle?: string | null,
    public photoContentType?: string | null,
    public photo?: string | null,
    public zones?: IZone[] | null,
    public user?: IUser | null
  ) {}
}

export function getEspaceVertIdentifier(espaceVert: IEspaceVert): number | undefined {
  return espaceVert.id;
}
