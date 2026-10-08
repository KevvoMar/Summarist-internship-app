import { createSlice } from "@reduxjs/toolkit";

interface User {
  email: string;
  uid: string;
  subscriptionPlan: "Basic" | "Premium";
  librarySaved: any[];
  libraryFinished: any[];
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = {
        email: action.payload.email,
        uid: action.payload.uid,
        subscriptionPlan: action.payload.subscriptionPlan,
        librarySaved: action.payload.librarySaved,
        libraryFinished: action.payload.libraryFinished,
      };
    },
    clearUser: (state) => {
      state.user = null;
    },
    updateLibrarySaved: (state, action) => {
      const { type, book } = action.payload;
      if (!state.user) return;

      if (type === "add") {
        state.user.librarySaved.push(book);
      }
      if (type === "remove") {
        state.user.librarySaved = state.user.librarySaved.filter(
          (b) => b.id !== book.id
        );
      }
    },
    updateLibraryFinished: (state, action) => {
      const { type, book } = action.payload;
      if (!state.user) return;

      if (type === "add") {
        const exists = state.user.libraryFinished.some((b) => b.id === book.id);
        if (!exists) {
          state.user.libraryFinished.push(book);
        }
      }
      if (type === "remove") {
        state.user.libraryFinished = state.user.libraryFinished.filter(
          (b) => b.id !== book.id
        );
      }
    },
  },
});

export const {
  setUser,
  clearUser,
  updateLibrarySaved,
  updateLibraryFinished,
} = authSlice.actions;

export default authSlice.reducer;