const base = import.meta.env.VITE_API_URL || "";
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${base}/api/v1${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      typeof body.detail === "string"
        ? body.detail
        : "Please check the form and try again.",
    );
  }
  return res.status === 204 ? (undefined as T) : res.json();
}
export const send = (method: string, data: unknown): RequestInit => ({
  method,
  body: JSON.stringify(data),
});
export async function uploadMedia(
  companyId: string,
  file: File,
): Promise<string> {
  if (file.size > 20 * 1024 * 1024)
    throw new Error("Choose a file smaller than 20 MB.");
  const signed = await api<{
    params: Record<string, string | number>;
    signature: string;
    api_key: string;
    cloud_name: string;
  }>(`/companies/${companyId}/media-signature`, send("POST", {}));
  const form = new FormData();
  for (const [key, value] of Object.entries(signed.params))
    form.append(key, String(value));
  form.append("signature", signed.signature);
  form.append("api_key", signed.api_key);
  form.append("file", file);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${signed.cloud_name}/auto/upload`,
    { method: "POST", body: form },
  );
  if (!res.ok) throw new Error("Media upload failed. Please try again.");
  return (await res.json()).secure_url;
}
