import { create } from "zustand";
import Cookies from "js-cookie";

interface UserResponse {
    id: string;
    email: string;
    username: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
}

interface AuthState {
    user: UserResponse | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    setAuth: (
        user: UserResponse,
        accessToken: string,
        refreshToken: string,
    ) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,

    setAuth: (user, accessToken, refreshToken) => {
        // Đảm bảo đồng bộ ghi cả vào Cookie khi Client thực hiện login thành công
        Cookies.set("refresh_token", refreshToken, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });
        Cookies.set("access_token", accessToken, {
            expires: 15 / 1440,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        set({
            user,
            accessToken,
            isAuthenticated: true,
        });
    },

    clearAuth: () => {
        // Xóa sạch cookie đầu client khi logout
        Cookies.remove("access_token", { path: "/" });
        Cookies.remove("refresh_token", { path: "/" });
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
        });
    },
}));
