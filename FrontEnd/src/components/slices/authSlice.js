import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  signupdata: null,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setToken(state, value) {
      state.token = value.payload;
    },
    setsignupdata(state, value) {
      state.signupdata = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
  },
});

export const { setToken, setsignupdata, setLoading } = authSlice.actions;
export default authSlice.reducer;
