import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: {
    credits: 100   // 👈 yahan tumhara default value
  }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    // 👇 extra useful reducers
    updateCredits: (state, action) => {
      state.userData.credits = action.payload;
    },

    incrementCredits: (state, action) => {
      state.userData.credits += action.payload;
    },

    logout: (state) => {
      state.userData = null;
    }
  }
});

export const {
  setUserData,
  updateCredits,
  incrementCredits,
  logout
} = userSlice.actions;

export default userSlice.reducer;