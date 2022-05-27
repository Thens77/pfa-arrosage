import { IArrosage } from 'app/entities/arrosage/arrosage.model';
import { IPlantation } from 'app/entities/plantation/plantation.model';
import { IGrandeur } from 'app/entities/grandeur/grandeur.model';
import { ITypeSol } from 'app/entities/type-sol/type-sol.model';
import { IEspaceVert } from 'app/entities/espace-vert/espace-vert.model';
import { IBoitier } from 'app/entities/boitier/boitier.model';

export interface IZone {
  id?: number;
  libelle?: string | null;
  superficie?: number | null;
  nbrMaxPlante?: number | null;
  photoContentType?: string | null;
  photo?: string | null;
  arrosages?: IArrosage[] | null;
  plantations?: IPlantation[] | null;
  grandeurs?: IGrandeur[] | null;
  typesol?: ITypeSol | null;
  espaceVert?: IEspaceVert | null;
  boitier?: IBoitier | null;
}

export class Zone implements IZone {
  constructor(
    public id?: number,
    public libelle?: string | null,
    public superficie?: number | null,
    public nbrMaxPlante?: number | null,
    public photoContentType?: string | null,
    public photo?: string | null,
    public arrosages?: IArrosage[] | null,
    public plantations?: IPlantation[] | null,
    public grandeurs?: IGrandeur[] | null,
    public typesol?: ITypeSol | null,
    public espaceVert?: IEspaceVert | null,
    public boitier?: IBoitier | null
  ) {}
}

export function getZoneIdentifier(zone: IZone): number | undefined {
  return zone.id;
}
