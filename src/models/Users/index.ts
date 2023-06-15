export interface UserResponse {
  id: number;
  name: string;
  email: string;
  token: string;
}
export interface DataCreateUser {
  email: string;
  mobile_phone: string;
  document: string;
  surname: string;
  password: string;
  name: string;
}
