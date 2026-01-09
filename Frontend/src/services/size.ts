// src/services/size.ts
import { http } from "../lib/http";

export type SizePayload = {
  id?: string;
  shoulders: number;
  chest: number;
  waist: number;
};

export async function saveSize(payload: SizePayload) {
  const res = await http.post('/auth/saveSize', payload);
  return res.data;
}
