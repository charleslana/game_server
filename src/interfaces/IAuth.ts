import IUserRole from './IUserRole';

export default interface IAuth {
  user: {
    id: number;
    roles: IUserRole[];
  };
}
