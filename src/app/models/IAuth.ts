export interface IRol {
    id_rol: number;
    nombre: string;
}

export interface IUser {
    id_usuario: string;
    email: string;
    full_name: string;
    id_rol: number;
    organization?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    last_login?: Date;
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
    id_rol?: number;
    organization?: string;
}

export interface ILoginInput {
    email: string;
    password: string;
}

export interface IJwtPayload {
    exp: number;
    sub: string;
    email: string;
    rol: string;
    id_rol: number;
    iat?: number;
}

export interface IUpdateUserInput {
    email?: string;
    password?: string;
    full_name?: string;
    id_rol?: number;
    organization?: string;
    is_active?: boolean;
}

// Password Reset Interfaces
export interface IRequestPasswordResetInput {
    email: string;
    frontendUrl: string;
}

export interface IResetPasswordInput {
    token: string;
    newPassword: string;
}

export interface IPasswordResetResponse {
    success: boolean;
    message: string;
}

export interface ITokenValidationResponse {
    valid: boolean;
    message?: string;
}