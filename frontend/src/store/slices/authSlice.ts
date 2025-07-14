import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { decodeJwt } from '@/lib/utils';

export const API_BASE_URL = 'http://localhost:5000/api/v1';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  hydrated: false,
};

// Hydrate auth state from localStorage on app load
export const hydrateAuth = createAsyncThunk(
  'auth/hydrateAuth',
  async (_, { dispatch }) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      let user: User | null = null;
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch {
          user = null;
        }
      }
      if (token) {
        const decoded = decodeJwt(token);
        if (decoded?.exp && Date.now() / 1000 > decoded.exp) {
          dispatch(logout());
        } else {
          dispatch(setToken(token));
          if (user) {
            dispatch(setUser(user));
          }
        }
      }
    }
    return true;
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'users/register',
  async (
    { username, name, email, password }: { username: string; name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Registration failed');
      }
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'users/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
        }
        const data = await res.json();
        throw new Error(data.message || 'Login failed');
      }
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk for logout (optional: for API logout or cleanup)
export const logoutUser = createAsyncThunk(
  'users/logout',
  async (_, { rejectWithValue }) => {
    try {

      return true;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous logout: clear all auth state and remove persisted token/user
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Hydrate
      .addCase(hydrateAuth.pending, (state) => {
        state.loading = true;
        state.hydrated = false;
      })
      .addCase(hydrateAuth.fulfilled, (state) => {
        state.loading = false;
        state.hydrated = true;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout async thunk
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      });
  },
});

export const { logout, setCredentials, setToken, setUser } = authSlice.actions;
export default authSlice.reducer; 