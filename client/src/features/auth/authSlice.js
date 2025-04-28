import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: true,
  showPassword: false,
  showSuccessMsg: false,
  formData: {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "",
    password: "",
    confirmPassword: "",
  },
  errors: {},
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleAuthMode: (state, action) => {
      //   state.isLogin = !state.isLogin;
      state.isLogin = action.payload;
    },
    togglePasswordVisibility: (state) => {
      state.showPassword = !state.showPassword;
    },
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.errors = {};
    },
    setShowSuccessMsg: (state, action) => {
      state.showSuccessMsg = action.payload;
    },
  },
});

export const {
  toggleAuthMode,
  togglePasswordVisibility,
  updateFormField,
  setErrors,
  setLoading,
  resetForm,
  setShowSuccessMsg,
} = authSlice.actions;

export default authSlice.reducer;
