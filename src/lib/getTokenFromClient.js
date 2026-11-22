"use client";

import { authClient } from "@/lib/auth-client";

export async function getTokenFromClient() {
  try {
    // Better Auth jwtClient plugin থেকে JWT token আনা
    if (typeof authClient?.token === "function") {
      const { data } = await authClient.token();
      if (data?.token) {
        return data.token;
      }
    }
  } catch {
    // fallback নিচে দেখা হবে
  }

  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      ""
    );
  }

  return "";
}