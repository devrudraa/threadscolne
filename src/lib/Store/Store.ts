import { configureStore } from "@reduxjs/toolkit";
import editorSlice from "./features/textEditor/editorSlice";

export const store = configureStore({
  reducer: editorSlice,
});

export type RootState = ReturnType<typeof store.getState>;
