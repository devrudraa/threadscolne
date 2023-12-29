import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState: { src: string | null; desc: string | null } = {
  src: null,
  desc: null,
};

export const editorSlice = createSlice({
  name: "editorImage",
  initialState,
  reducers: {
    updateImgDesc: (state, action) => {
      state.desc = action.payload;
    },
    updateImgSrc: (state, action) => {
      state.src = action.payload;
    },
    removeImgSrc: (state) => {
      state.src = null;
    },
  },
});

export const { removeImgSrc, updateImgSrc, updateImgDesc } =
  editorSlice.actions;
export default editorSlice.reducer;
