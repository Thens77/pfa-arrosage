export interface ITypeSol {
  id?: number;
  libelle?: string | null;
}

export class TypeSol implements ITypeSol {
  constructor(public id?: number, public libelle?: string | null) {}
}

export function getTypeSolIdentifier(typeSol: ITypeSol): number | undefined {
  return typeSol.id;
}
