import { http } from "@/lib/http";
import {
    LoginInput,
    LoginResponse,
    RegisterInput,
    RegisterResponse,
    ForgotPasswordInput,
    ResetPasswordInput,
    CommonResponse,
    VerifyInput,
    GoogleLoginInput,
    RefreshTokenInput,
} from "@/types/auth.dto";

export const authService = {
    register: async (data: RegisterInput): Promise<RegisterResponse> => {
        const res = await http.post("/api/auth/register", data);
        return res.json();
    },

    verify: async (data: VerifyInput): Promise<LoginResponse> => {
        const res = await http.post("/api/auth/verify", data);
        return res.json();
    },

    login: async (data: LoginInput): Promise<LoginResponse> => {
        const res = await http.post("/api/auth/login", data);
        return res.json();
    },

    loginWithGoogle: async (data: GoogleLoginInput): Promise<LoginResponse> => {
        const res = await http.post("/api/auth/google", data);
        return res.json();
    },

    logout: async (refreshToken: string): Promise<CommonResponse> => {
        const res = await http.post("/api/auth/logout", { refreshToken });
        return res.json();
    },

    forgotPassword: async (
        data: ForgotPasswordInput,
    ): Promise<CommonResponse> => {
        const res = await http.post("/api/auth/forgot-password", data);
        return res.json();
    },

    resetPassword: async (
        data: ResetPasswordInput,
    ): Promise<CommonResponse> => {
        const res = await http.post("/api/auth/reset-password", data);
        return res.json();
    },

    refreshToken: async (data: RefreshTokenInput): Promise<LoginResponse> => {
        const res = await http.post("/api/auth/refresh-token", data);
        return res.json();
    },
};
