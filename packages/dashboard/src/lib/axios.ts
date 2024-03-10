import axios from "axios";
// import { store } from "../redux/store";
import staffService from "../services/auth";
// import { unauthenticate } from "../redux/auth-reducer";


export const axiosClientWithToken = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
})



axiosClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
  
      // Check if the error is due to an expired token
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          // Attempt to refresh the token
          const result = await staffService.refreshToken();
  
          // Update the headers with the new token
          axiosClient.defaults.headers.common.Authorization = `Bearer ${result.accessToken}`;
  
          // Retry the original request with the new token
          return axiosClient(originalRequest);
        } catch (refreshError) {
          // Handle the case when the refresh token request fails
          console.error('Error refreshing token:', refreshError);
  
          // store.dispatch(unauthenticate())
          return Promise.reject(error);
        }
      }
  
      // If the error is not due to an expired token, or the refresh token fails, reject the promise
      return Promise.reject(error);
    }
);
  

export default axiosClient;
