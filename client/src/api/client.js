const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api";

// Helper to get auth headers
const getAuthHeaders = (isForm = false) => {
  const token = localStorage.getItem("token");
  const headers = isForm ? {} : { "Content-Type": "application/json" };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

export const api = {
  get: (path) => 
    fetch(BASE_URL + path, { 
      credentials: "include",
      headers: getAuthHeaders()
    }),
  post: (path, data, isForm) =>
    fetch(BASE_URL + path, {
      method: "POST",
      headers: getAuthHeaders(isForm),
      body: isForm ? data : JSON.stringify(data),
      credentials: "include",
    }),
  put: (path, data, isForm) =>
    fetch(BASE_URL + path, {
      method: "PUT",
      headers: getAuthHeaders(isForm),
      body: isForm ? data : JSON.stringify(data),
      credentials: "include",
    }),
  del: (path, data) =>
    fetch(BASE_URL + path, {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
      credentials: "include",
    }),
};

// Resolve media URLs returned by the API. If the URL is a server-relative
// upload path (e.g. "/uploads/..."), prefix it with the API base host.
export const toMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('/uploads')) {
    const host = import.meta.env.VITE_API_BASE_URL || '';
    return host + url;
  }
  return url;
};

