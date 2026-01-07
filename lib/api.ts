const API_BASE_URL = "http://127.0.0.1:8000";
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("df_token")
      : null;

  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Token ${token}` }),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      data,
    };
  }

  return data;
}
