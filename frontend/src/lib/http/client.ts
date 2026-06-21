import Cookies from "js-cookie";
import { useAuthStore } from "@/store/AuthStore";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

async function handleRefreshToken(): Promise<string | null> {
    if (isRefreshing) {
        return new Promise((resolve) => {
            subscribeTokenRefresh((token) => resolve(token));
        });
    }

    isRefreshing = true;
    const refreshToken = Cookies.get("refresh_token");

    try {
        const { authService } = await import("@/services/auth");
        const result = await authService.refreshToken({
            refreshToken: refreshToken || "",
        });

        // Map theo đúng cấu trúc dữ liệu phẳng từ Backend trả về
        if (result.status === "success" && result.data.accessToken) {
            const {
                accessToken,
                refreshToken: newRefreshToken,
                user,
            } = result.data;

            // Lưu Refresh Token (Hạn 7 ngày)
            Cookies.set("refresh_token", newRefreshToken, {
                expires: 7,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });

            // Lưu Access Token (Hạn 15 phút = 15 / 1440 ngày)
            Cookies.set("access_token", accessToken, {
                expires: 15 / 1440,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });

            // Đồng bộ vào Zustand Store cho Client sử dụng tiện lợi
            useAuthStore.getState().setAuth(user, accessToken, newRefreshToken);

            onRefreshed(accessToken);
            return accessToken;
        }
    } catch (error) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        useAuthStore.getState().clearAuth();
    } finally {
        isRefreshing = false;
    }
    return null;
}

export const httpClient = async (
    endpoint: string,
    options: RequestInit = {},
) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${endpoint}`;

    // Lấy access token hiện tại từ cookie để gắn vào header
    const accessToken = Cookies.get("access_token");

    options.headers = {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
    };

    let response = await fetch(url, options);

    if (response.status === 401 && !endpoint.includes("refresh-token")) {
        const newAccessToken = await handleRefreshToken();
        if (newAccessToken) {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${newAccessToken}`,
            };
            response = await fetch(url, options);
        } else {
            if (typeof window !== "undefined") {
                window.location.href = "/logout?reason=expired";
            }
        }
    }

    return response;
};
