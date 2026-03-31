"use client";

import { createContext, useContext, ReactNode } from "react";
import { Buyer } from "../types/ApiResponse";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";

type AuthContextType = {
  user: Buyer | null;
  isLoading: boolean;
  logout: () => void;
  isLoggingOut: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // ✅ Get logged-in user
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await authApi.me();
      return res.data.buyer;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // ✅ Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      // Remove favorites cache
      queryClient.removeQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      queryClient.setQueryData(["me"], null);
    },
  });




  return (
    <AuthContext.Provider
      value={{
        user: data ?? null,
        isLoading,
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};