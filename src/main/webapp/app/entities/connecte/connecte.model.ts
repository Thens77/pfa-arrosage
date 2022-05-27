import { ICapteur } from 'app/entities/capteur/capteur.model';
import { IBoitier } from 'app/entities/boitier/boitier.model';

export interface IConnecte {
  id?: number;
  fonctionnel?: boolean | null;
  branche?: string | null;
  capteur?: ICapteur | null;
  boitier?: IBoitier | null;
}

export class Connecte implements IConnecte {
  constructor(
    public id?: number,
    public fonctionnel?: boolean | null,
    public branche?: string | null,
    public capteur?: ICapteur | null,
    public boitier?: IBoitier | null
  ) {
    this.fonctionnel = this.fonctionnel ?? false;
  }
}

export function getConnecteIdentifier(connecte: IConnecte): number | undefined {
  return connecte.id;
}
