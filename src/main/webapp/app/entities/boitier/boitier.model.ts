import { IZone } from 'app/entities/zone/zone.model';
import { IConnecte } from 'app/entities/connecte/connecte.model';
import { IInstallation } from 'app/entities/installation/installation.model';

export interface IBoitier {
  id?: number;
  refrence?: string | null;
  nbrBranche?: number | null;
  zones?: IZone[] | null;
  connectes?: IConnecte[] | null;
  installation?: IInstallation | null;
}

export class Boitier implements IBoitier {
  constructor(
    public id?: number,
    public refrence?: string | null,
    public nbrBranche?: number | null,
    public zones?: IZone[] | null,
    public connectes?: IConnecte[] | null,
    public installation?: IInstallation | null
  ) {}
}

export function getBoitierIdentifier(boitier: IBoitier): number | undefined {
  return boitier.id;
}
