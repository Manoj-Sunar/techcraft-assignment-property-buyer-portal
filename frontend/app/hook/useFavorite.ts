import { useQuery } from "@tanstack/react-query";
import { favoriteApi } from "../api/favorite.api";
import { useAuth } from "../components/AuthContext";


export const useFavorites = () => {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["favorites"],
    queryFn: favoriteApi.getMine,
    enabled: !!user, // ❗ Only fetch favorites if logged in
  });

  // ✅ Extract property IDs safely
  const favoriteIds = data?.data?.map((fav) => fav.property._id) || [];

  return {
    favoriteIds,
    favorites: data?.data || [],
  };
};