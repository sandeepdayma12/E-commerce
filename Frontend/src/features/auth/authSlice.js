import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosConfig'

// 🔹 User Register
export const userRegister = createAsyncThunk('auth/userRegister', async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/user/register', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'User registration failed')
  }
})

// 🔹 Admin Register
export const adminRegister = createAsyncThunk('auth/adminRegister', async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/admin/register', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Admin registration failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null, success: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🧩 User Register
      .addCase(userRegister.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.success = true
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // 🧩 Admin Register
      .addCase(adminRegister.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(adminRegister.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.success = true
      })
      .addCase(adminRegister.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default authSlice.reducer
