import React, { createContext, useEffect, useMemo, useReducer } from "react";
import { savedReducer, type SavedAction, type SavedState } from "../../reducers/SavedReducer";

const initialSavedState: SavedState = {
  savedItems: [],
  lastError: null,
};

type SavedContextValue = {
  state: SavedState;
  dispatch: React.Dispatch<SavedAction>;
};

export const SavedContext = createContext<SavedContextValue | null>(null);

export const SavedProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(savedReducer, initialSavedState);

  useEffect(() => {
  const id = Math.random().toString(16).slice(2);
  console.log("SavedProvider MOUNT", id);
  return () => console.log("SavedProvider UNMOUNT", id);
}, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
};
