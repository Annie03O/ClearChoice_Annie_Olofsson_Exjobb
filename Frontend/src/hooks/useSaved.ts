import { useContext } from "react";
import { SavedContext } from "../components/Saved/SavedProvider";

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used inside SavedProvider");
  return ctx;
}