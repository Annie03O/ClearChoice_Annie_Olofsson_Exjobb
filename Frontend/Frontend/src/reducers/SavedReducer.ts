import type { SavedItem} from "../models/Types/Cart/CartItem";

export type SavedState = {
    savedItems: SavedItem[] 
    lastError: "DUPLICATE_ITEM" | null
}
export type SavedAction =
  | { type: "ADD_ITEM"; payload: SavedItem;}
  | { type: "REMOVE_ITEM"; id: string}
  | { type: "CLEAR"}
  | { type: "CLEAR_ERROR" };



export function savedReducer(state: SavedState, action: SavedAction): SavedState {
   
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.savedItems.some((i) => i.id === action.payload.productId);

      if (existing) {
        return {...state, lastError: "DUPLICATE_ITEM"}
      }
      return { 
        savedItems: [...state.savedItems, { ...action.payload}],
        lastError:null, 
      };
    }


    case "REMOVE_ITEM":
      return { 
        ...state,
        savedItems: state.savedItems.filter((i) => i.id !== action.id ), 
      };

    case "CLEAR":
      return { 
        savedItems: [],
        lastError: null
      };

    case "CLEAR_ERROR":
      return {...state, lastError: null}

    default:
      return state;
  }
}
