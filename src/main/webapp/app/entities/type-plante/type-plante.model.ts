export interface ITypePlante {
  id?: number;
  humiditeMin?: number | null;
  humiditeMax?: number | null;
  temperatureMin?: number | null;
  temperatureMax?: number | null;
  limunosite?: number | null;
  libelle?: string | null;
}

export class TypePlante implements ITypePlante {
  constructor(
    public id?: number,
    public humiditeMin?: number | null,
    public humiditeMax?: number | null,
    public temperatureMin?: number | null,
    public temperatureMax?: number | null,
    public limunosite?: number | null,
    public libelle?: string | null
  ) {}
}

export function getTypePlanteIdentifier(typePlante: ITypePlante): number | undefined {
  return typePlante.id;
}
