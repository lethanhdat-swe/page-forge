import { redirect } from "next/navigation";

export const httpServer = async (
    endpoint: string,
    options: RequestInit = {},
) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${endpoint}`;

    const { cookies } = await import("next/headers");

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const cookieHeader = cookieStore.toString();

    options.headers = {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
    };

    const response = await fetch(url, options);

    if (response.status === 401) {
        cookieStore.delete("access_token");
        cookieStore.delete("refresh_token");
        redirect("/logout?reason=expired");
    }

    return response;
};
