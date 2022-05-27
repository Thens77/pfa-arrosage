import dayjs from 'dayjs/esm';

export interface IInstallation {
  id?: number;
  dateDebut?: dayjs.Dayjs | null;
  dateFin?: dayjs.Dayjs | null;
}

export class Installation implements IInstallation {
  constructor(public id?: number, public dateDebut?: dayjs.Dayjs | null, public dateFin?: dayjs.Dayjs | null) {}
}

export function getInstallationIdentifier(installation: IInstallation): number | undefined {
  return installation.id;
}
