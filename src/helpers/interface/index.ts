export interface IRegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ICreateTaskPayload {
  title: string;
  description: string;
  status: string;
}

export interface IUpdateTaskPayload {
  title?: string;
  description?: string;
  status?: string;
}
