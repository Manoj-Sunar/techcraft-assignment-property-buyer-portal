import { ApiResponse, PaginatedResponse, Property } from "../types/ApiResponse";
import { apiClient } from "./apiClient";

export const propertyApi = {
  getAll: (page = 1) =>
    apiClient.get<PaginatedResponse<Property>>(
      `/api/properties?page=${page}`,
    ),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Property>>(`/property/${id}`),
};