import { apiClient } from "./apiClient";

export interface FavoriteItem {
  _id: string;
  property: any; // or Property if you want strict
}

export interface IFavoriteResponse {
  success: boolean;
  count: number;
  data: FavoriteItem[];
}

export const favoriteApi = {
  add: (propertyId: string) =>
    apiClient.post(`/api/favorite/${propertyId}`, {}),

  remove: (propertyId: string) =>
    apiClient.delete(`/api/favorite/unfavorite/${propertyId}`),

  // ✅ FIXED
  getMine: () =>
    apiClient.get<IFavoriteResponse>(`/api/favorite/favorite-property`),
};