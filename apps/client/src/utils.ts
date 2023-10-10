const API_URL = import.meta.env.VITE_API_URL as string;

export async function fetcher({
  route,
  method = "GET",
  headers = {},
  body,
}: {
  route: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: string | FormData;
}) {
  const res = await fetch(`${API_URL}${route}`, {
    method,
    headers,
    body,
  });

  return res;
}
