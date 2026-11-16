// Fungsi pembantu untuk memanggil backend (otomatis kirim token login)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function api(path: string, method = "GET", body?: object) {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Terjadi kesalahan");
  return data;
}
