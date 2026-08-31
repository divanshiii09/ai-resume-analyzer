import axios from "axios";

// Empty base URL: the API is same-origin behind /api on Vercel, and Vite's dev
// server proxies /api to the local backend. Relative URLs mean preview
// deployments work on their own hostname with no configuration, and there is no
// build-time env var to forget. VITE_API_URL stays available as an override for
// pointing a local frontend at a deployed backend.
const baseURL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 means the token is missing, invalid or expired: clear it and send the
// user back to login rather than leaving the UI in a half-authenticated state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }
    return Promise.reject(error);
  }
);

// The PDF route requires an Authorization header, which window.open cannot
// send. Fetch the bytes through axios, then open a blob URL instead.
export async function openResumeFile(id) {
  const { data } = await api.get(`/api/resume/${id}/file`, {
    responseType: "blob",
  });

  const url = URL.createObjectURL(data);
  window.open(url, "_blank", "noopener");

  // Give the new tab time to load before releasing the object URL.
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export default api;
