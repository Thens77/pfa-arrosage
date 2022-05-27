export interface IUser {
  id?: number;
  login?: string;
  first?: string;
  last?: string ;
}

export class User implements IUser {
  constructor(public id: number, public login: string , public first: string,public last: string ) {}
}

export function getUserIdentifier(user: IUser): number | undefined {
  return user.id;
}
