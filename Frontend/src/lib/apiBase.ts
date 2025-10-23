import axios from "axios";

export const API_BASE = "http://localhost:4000";

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});