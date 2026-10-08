import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux"; // Added useDispatch
import type { RootState, AppDispatch } from "./store"; // We will add AppDispatch to your store next

// Your current selector code:
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// NEW HOOK: Add this strongly-typed dispatch hook for component actions
export const useAppDispatch = () => useDispatch<AppDispatch>();
