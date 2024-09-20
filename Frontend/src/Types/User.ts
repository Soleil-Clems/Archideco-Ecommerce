export type User = {
  id: number;
  email: string;
  roles: string[];
  password: string;
};

export type UserBody = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
};
export type UserBodyNoPsw = {
  email: string;
  firstname: string;
  lastname: string;
};

export type Newsletter = {
  email: string;
};
