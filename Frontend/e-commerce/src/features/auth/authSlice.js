import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// const BaseUrl = import.meta.env.VITE_API_URL + "/api/auth"
const BaseUrl = "http://localhost:8080/api/auth"

export const sendOtp = createAsyncThunk("auth/sendOtp", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BaseUrl}/send-otp`, data, { withCredentials: true });
    return res.data
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || "Failed to send OTP")
  }
})
export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BaseUrl}/verify-otp`, data, { withCredentials: true });
    return res.data
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || "Failed to verify OTP")
  }
})

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BaseUrl}/login`, data, { withCredentials: true });
      return res.data;
    } catch (err) {

      return rejectWithValue(err?.response?.data?.message || "Login failed");
    }
  }
);
export const loginWithGoogle = createAsyncThunk("auth/google", async (token, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BaseUrl}/google`, { token }, { withCredentials: true });
    return res.data
  } catch (err) {

    return rejectWithValue(err?.response?.message || "Login failed")
  }
})

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BaseUrl}/logout`, {}, { withCredentials: true });
    return res.data
  } catch (err) {

    return rejectWithValue(err?.response?.message || "Logout failed")
  }
})

export const addAddress = createAsyncThunk(
  "auth/addAddress",
  async (data, { rejectWithValue, dispatch }) => {
    try {

      const res = await axios.post(
        `${BaseUrl}/address`,
        data,
        {
          withCredentials: true,
        }
      );

      dispatch(setCurrentAddress(res.data.address))
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to add address");
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BaseUrl}/fetchUser`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: null,
    currentAddress: JSON.parse(localStorage.getItem("currentAddress")) || null,
    loading: false,
    authChecked: false,
    otpLoading: false,



  },
  reducers: {
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload;
    },
    logout(state) {
      state.user = null;

    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload
      localStorage.setItem("currentAddress", JSON.stringify(action.payload));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpLoading = true;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpLoading = false;

      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.otpLoading = false;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpLoading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.otpLoading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.otpLoading = false;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginWithGoogle.pending, (state, action) => {
        state.loading = true;
        state.error = null
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH USER
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;

      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.authChecked = true
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.authChecked = true
      })

      // ADD ADDRESS
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export const { logout, setCurrentAddress, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
