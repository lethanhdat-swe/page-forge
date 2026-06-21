export interface UserResponse {
    id: string;
    email: string;
    username: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
}

export interface AuthDataPayload {
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
}

export interface CommonResponse {
    status: "success" | "error";
    message: string;
}

export interface LoginResponse extends CommonResponse {
    data: AuthDataPayload;
}

export interface RegisterResponse extends CommonResponse {
    data: {
        user: UserResponse;
    };
}

export interface RegisterInput {
    username: string;
    email: string;
    password?: string;
}

export interface LoginInput {
    email: string;
    password?: string;
}

export interface ForgotPasswordInput {
    email: string;
}

export interface ResetPasswordInput {
    token: string;
    newPassword?: string;
}

export interface VerifyInput {
    token: string;
}

export interface GoogleLoginInput {
    idToken: string;
}

export interface RefreshTokenInput {
    refreshToken: string;
}
