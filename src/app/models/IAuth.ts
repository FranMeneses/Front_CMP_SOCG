export interface IRol {
    id_rol: number;
    nombre: string;
}

export interface IUser {
    id_usuario: number;
    email: string;
    full_name: string;
    id_rol: number;
    organization: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    last_login: Date;
    rol: IRol;
}

export interface IAuthResponse {
    access_token: string;
    user: IUser;
}

export interface IRegisterInput {
    email: string;
    password: string;
    full_name: string;
    id_rol: number;
    organization: string;
}

export interface ILoginInput {
    email: string;
    password: string;
}

export interface IJwtPayload {
  exp: number;
}