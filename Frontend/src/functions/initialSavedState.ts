import type { SavedState } from "../reducers/SavedReducer";

const STORAGE_KEY = "clearchoice_saved_v1"

// Init-funktion: körs en gång när reducer skapas
export function initialSavedState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { savedItems: [], lastError: null};

    const parsed = JSON.parse(raw) as SavedState;
    
    return {savedItems: Array.isArray(parsed.savedItems) ? parsed.savedItems : [], lastError: null};
  } catch {
    return {savedItems: [], lastError: null};
  }
}