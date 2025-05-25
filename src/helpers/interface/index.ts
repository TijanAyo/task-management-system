export interface IRegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
