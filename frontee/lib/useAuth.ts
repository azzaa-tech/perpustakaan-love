"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type User = { id: number; nama: string; username: string; role: "admin" | "siswa" };

// Dipakai di tiap halaman untuk memastikan user sudah login.
// useAuth("admin")  -> hanya admin | useAuth("siswa") -> hanya siswa
export function useAuth(role?: "admin" | "siswa") {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      router.push("/login");
      return;
    }
    const u: User = JSON.parse(saved);
    if (role && u.role !== role) {
      router.push(u.role === "admin" ? "/admin" : "/dashboard");
      return;
    }
    setUser(u);
  }, []);

  return user;
}
