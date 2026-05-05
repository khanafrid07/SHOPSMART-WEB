import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BaseUrl = import.meta.env.VITE_API_URL + "/api/auth"

export const sendOtp = createAsyncThunk("auth/sendOtp", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BaseUrl}/send-otp`, data);
    return res.data
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || "Failed to send OTP")
  }
})
export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BaseUrl}/verify-otp`, data);
    return res.data
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || "Failed to verify OTP")
  }
})

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BaseUrl}/login`, data);
      return res.data;
    } catch (err) {
      ("ERROR:", err.response?.data);
      return rejectWithValue(err?.response?.data?.message || "Login failed");
    }
  }
);
export const loginWithGoogle = createAsyncThunk("auth/google", async (token, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BaseUrl}/google`, { token });
    return res.data
  } catch (err) {
    ("GOOGLE ERROR:", err.response?.data);
    return rejectWithValue(err?.response?.message || "Login failed")
  }
})

export const addAddress = createAsyncThunk(
  "auth/addAddress",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BaseUrl}/address`,
        data,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      const token = localStorage.getItem("token");

      if (!token || token == undefined || token == null || token.trim() == '') {
        return rejectWithValue("No token");
      }

      const res = await axios.get(`${BaseUrl}/fetchUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
      }
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
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
      state.token = null;
      localStorage.removeItem("token");
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
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
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
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
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
        state.user = action.payload.user
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
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
      });
  },
});

export const { logout, setCurrentAddress, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
