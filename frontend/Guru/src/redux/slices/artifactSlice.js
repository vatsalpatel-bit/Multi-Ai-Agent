import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  artifacts: [],
  activeArtifactId: null,
  activeFileIndex: 0,
  isOpen: false,
};

const artifactSlice = createSlice({
  name: "artifact",
  initialState,
  reducers: {
    setArtifacts: (state, action) => {
      state.artifacts = action.payload;

      state.activeArtifactId =
        action.payload.at(-1)?.id ?? null;

      state.activeFileIndex = 0;
    },

    setActiveArtifact: (state, action) => {
      state.activeArtifactId = action.payload;
      state.activeFileIndex = 0;
    },

    setActiveFileIndex: (state, action) => {
      state.activeFileIndex = action.payload;
    },

    openArtifactPanel: (state) => {
      state.isOpen = true;
    },

    closeArtifactPanel: (state) => {
      state.isOpen = false;
    },

    clearArtifacts: (state) => {
      state.artifacts = [];
      state.activeArtifactId = null;
      state.activeFileIndex = 0;
      state.isOpen = false;
    },
  },
});

export const {
  setArtifacts,
  setActiveArtifact,
  setActiveFileIndex,
  openArtifactPanel,
  closeArtifactPanel,
  clearArtifacts,
} = artifactSlice.actions;

export default artifactSlice.reducer;