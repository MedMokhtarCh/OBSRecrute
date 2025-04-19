import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const updateProfileSlice = createSlice({
  name: "updateProfile",
  initialState: {
    loading: false,
    error: null,
    isUpdated: false,
    forgotPasswordLoading: false,
    forgotPasswordSuccess: null,
    forgotPasswordError: null,

    resetPasswordLoading: false,
    resetPasswordSuccess: null,
    resetPasswordError: null,
  },
  reducers: {
    updateProfileRequest(state, action) {
      state.loading = true;
    },
    updateProfileSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.isUpdated = true;
    },
    updateProfileFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.isUpdated = false;
    },
    updatePasswordRequest(state, action) {
      state.loading = true;
    },
    updatePasswordSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.isUpdated = true;
    },
    updatePasswordFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.isUpdated = false;
    },

    forgotPasswordRequest(state) {
      state.forgotPasswordLoading = true;
      state.forgotPasswordSuccess = null;
      state.forgotPasswordError = null;
    },
    forgotPasswordSuccess(state, action) {
      state.forgotPasswordLoading = false;
      state.forgotPasswordSuccess = action.payload;
    },
    forgotPasswordFailed(state, action) {
      state.forgotPasswordLoading = false;
      state.forgotPasswordError = action.payload;
    },

    // Reset Password
    resetPasswordRequest(state) {
      state.resetPasswordLoading = true;
      state.resetPasswordSuccess = null;
      state.resetPasswordError = null;
    },
    resetPasswordSuccess(state, action) {
      state.resetPasswordLoading = false;
      state.resetPasswordSuccess = action.payload;
    },
    resetPasswordFailed(state, action) {
      state.resetPasswordLoading = false;
      state.resetPasswordError = action.payload;
    },

    profileResetAfterUpdate(state) {
      state.error = null;
      state.isUpdated = false;
      state.loading = false;
      state.forgotPasswordLoading = false;
      state.forgotPasswordSuccess = null;
      state.forgotPasswordError = null;
      state.resetPasswordLoading = false;
      state.resetPasswordSuccess = null;
      state.resetPasswordError = null;
    },
  },
});

export const updateProfile = (data) => async (dispatch) => {
  dispatch(updateProfileSlice.actions.updateProfileRequest());
  try {
    const response = await axios.put(
      "http://localhost:4001/api/v1/user/update/Profile",
      data,
      {
        withCredentials: true,
      }
    );
    dispatch(updateProfileSlice.actions.updateProfileSuccess());
  } catch (error) {
    dispatch(
      updateProfileSlice.actions.updateProfileFailed(
        error.response.data.message || "Failed to update profile."
      )
    );
  }
};
export const updatePassword = (data) => async (dispatch) => {
  dispatch(updateProfileSlice.actions.updatePasswordRequest());
  try {
    const response = await axios.put(
      "http://localhost:4001/api/v1/user/update/password",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(updateProfileSlice.actions.updatePasswordSuccess());
  } catch (error) {
    dispatch(
      updateProfileSlice.actions.updatePasswordFailed(
        error.response.data.message || "Failed to update password."
      )
    );
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(updateProfileSlice.actions.forgotPasswordRequest());
  try {
    const response = await axios.post(
      "http://localhost:4001/api/v1/user/forgot-password",
      { email },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(
      updateProfileSlice.actions.forgotPasswordSuccess(response.data.message)
    );
  } catch (error) {
    dispatch(
      updateProfileSlice.actions.forgotPasswordFailed(
        error.response?.data?.message || "Error requesting reset"
      )
    );
  }
};

export const resetPassword = (data) => async (dispatch) => {
  dispatch(updateProfileSlice.actions.resetPasswordRequest());
  try {
    const response = await axios.post(
      "http://localhost:4001/api/v1/user/reset-password",
      data,
      { headers: { "Content-Type": "application/json" } }
    );
    dispatch(
      updateProfileSlice.actions.resetPasswordSuccess(response.data.message)
    );
  } catch (error) {
    dispatch(
      updateProfileSlice.actions.resetPasswordFailed(
        error.response?.data?.message || "Error resetting password"
      )
    );
  }
};

export const clearAllUpdateProfileErrors = () => (dispatch) => {
  dispatch(updateProfileSlice.actions.profileResetAfterUpdate());
};

export default updateProfileSlice.reducer;
