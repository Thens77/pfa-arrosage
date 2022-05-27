export interface ICapteur {
  id?: number;
  type?: string | null;
  reference?: string | null;
  photoContentType?: string | null;
  photo?: string | null;
  frequence?: number | null;
}

export class Capteur implements ICapteur {
  constructor(
    public id?: number,
    public type?: string | null,
    public reference?: string | null,
    public photoContentType?: string | null,
    public photo?: string | null,
    public frequence?: number | null
  ) {}
}

export function getCapteurIdentifier(capteur: ICapteur): number | undefined {
  return capteur.id;
}
