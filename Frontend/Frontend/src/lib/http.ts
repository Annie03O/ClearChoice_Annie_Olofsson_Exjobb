// src/lib/http.ts
import axios from 'axios';


export const http = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE ?? "http://localhost:4000") + "/api",
  withCredentials: true
});