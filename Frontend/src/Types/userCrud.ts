interface DateTime {
  date: string;
  timezone_type: number;
  timezone: string;
}

interface UserComplement {
  id: number;
  zipcode: string;
  adresse: string;
  phone: string;
}

export interface UserData {
  id: number;
  email: string;
  roles: string[];
  firstname: string;
  lastname: string;
  picture: string | null;
  verified: boolean;
  created_at: DateTime;
  updated_at: DateTime;
  is_actif: boolean;
  user_complements: UserComplement[];
  commandes:any
}

export interface ApiResponse {
  value: string | ApiResponse | PromiseLike<string | ApiResponse>;
  data: UserData[];
}

export interface UpdateUserFields {
  email?: string;
  firstname?: string;
  lastname?: string;
  roles?: string;
  password?: string;
  picture?: string;
}

export interface UserComplementBody {
  zip_code: string;
  adresse: string;
  sexe: string;
  phone: string;
}
