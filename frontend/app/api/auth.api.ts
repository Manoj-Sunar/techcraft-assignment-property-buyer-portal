import { ApiResponse, Buyer, LoginResponse, LogoutResponse } from "../types/ApiResponse";
import { apiClient } from "./apiClient";

export const authApi = {
    login: (body: { email: string; password: string }) =>
        apiClient.post<ApiResponse<LoginResponse>, typeof body>(
            "/api/buyer/login",
            body
        ),

    register: (body: {
        name: string;
        email: string;
        password: string;
    }) =>
        apiClient.post("/api/buyer/register", body),

    logout:()=>apiClient.post("/api/buyer/logout",{}),  

    me: () => apiClient.get<ApiResponse<{ buyer: Buyer }>>("/api/buyer/me"),
};