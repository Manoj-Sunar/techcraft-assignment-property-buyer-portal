"use client";

import { useState } from "react";
import InputField from "../components/UI/InputField";
import { Lock, Mail, User } from "lucide-react";
import Button from "../components/UI/Button";
import { authApi } from "../api/auth.api";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ✅ error state

  const router = useRouter();
  const queryClient = useQueryClient();

  const handleAuthFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // clear old error

    try {
      if (isLogin) {
        await authApi.login({ email, password });
      } else {
        await authApi.register({ name, email, password });
      }

      // ✅ Refetch user after login
      await queryClient.invalidateQueries({ queryKey: ["me"] });

      // ✅ Redirect
      router.push("/");
    } catch (err: any) {


      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (err?.response?.data?.errors &&
          (Object.values(err.response.data.errors)[0] as any)?.message) ||
        err?.message ||
        "Something went wrong";

      setError(message);


    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 w-full bg-gray-50">
      <div className="w-full sm:max-w-lg md:max-w-md border border-gray-200 rounded-2xl p-5 md:p-8 shadow-sm bg-white">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
        </div>

        {/* ❌ Error Message */}
        {error && (
          <div className="mt-4 bg-red-100 text-red-600 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form
          className="flex flex-col gap-4 mt-6"
          onSubmit={handleAuthFormSubmit}
        >
          {/* Name */}
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <InputField
                type="text"
                value={name}
                setValue={(val: string) => {
                  setName(val);
                  setError("");
                }}
                placeholder="Name"
                className="pl-10"
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <InputField
              type="email"
              value={email}
              setValue={(val: string) => {
                setEmail(val);
                setError("");
              }}
              placeholder="Email"
              className="pl-10"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <InputField
              type="password"
              value={password}
              setValue={(val: string) => {
                setPassword(val);
                setError("");
              }}
              placeholder="Password"
              className="pl-10"
            />
          </div>

          {/* Button */}
          <Button
            type="submit"
            isLogin={isLogin}
            loading={loading}
            className="bg-[#7c73e6]"
          />

          {/* Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsLogin((prev) => !prev);
              setError(""); // clear error when switching
            }}
            className="text-sm text-indigo-600 text-center"
          >
            {isLogin ? "Create account" : "Already have account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;