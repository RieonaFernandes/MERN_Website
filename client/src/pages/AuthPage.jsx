import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
  FiPhone,
} from "react-icons/fi";
import { encrypt } from "../utils/util";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleAuthMode,
  togglePasswordVisibility,
  updateFormField,
  setErrors,
  setLoading,
  resetForm,
  setShowSuccessMsg,
} from "../features/auth/authSlice";
const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
import Cookies from "js-cookie";

const AuthPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin, showPassword, showSuccessMsg, formData, errors, loading } =
    useSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@'"_\-]+@[^\s@'"_\-]+\.[^\s@'"_\-]+$/;
    const nameRegex = /^[A-Za-z]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\-$'"`*]).{8,}$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      } else if (!nameRegex.test(formData.firstName)) {
        newErrors.firstName = "First name should contain only letters";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      } else if (!nameRegex.test(formData.lastName)) {
        newErrors.lastName = "Last name should contain only letters";
      }

      if (formData.middleName.trim() && !nameRegex.test(formData.middleName)) {
        newErrors.middleName = "Middle name should contain only letters";
      }

      const phoneRegex = /^\d+$/;
      if (formData.phone && !phoneRegex.test(formData.phone)) {
        newErrors.phone = "Invalid phone number format";
      }

      if (formData.countryCode && !/^\+\d{1,4}$/.test(formData.countryCode)) {
        newErrors.countryCode = "Invalid country code (format: +XXX)";
      }

      if (formData.phone && !formData.countryCode) {
        newErrors.countryCode = "Country code is required with phone number";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          "Password must contain: 1 uppercase, 1 lowercase, 1 number, and 1 special character (except -$'\"`*)";
      }
    }

    dispatch(setErrors(newErrors));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(setLoading(true));

    try {
      const apiUrl = isLogin
        ? `${baseUrl}/user/login`
        : `${baseUrl}/user/register`;

      // Encrypt sensitive fields
      const encryptedEmail = encrypt(formData.email);
      const encryptedPassword = encrypt(formData.password);
      const encryptedLastName = encrypt(formData.lastName);
      const requestBody = {
        ...(isLogin
          ? {}
          : {
              firstName: formData.firstName,
              middleName: formData.middleName,
              lastName: encryptedLastName,
            }),
        email: encryptedEmail,
        password: encryptedPassword,
        ...(!isLogin && {
          ...(formData.phone && { phone: formData.phone }),
          ...(formData.countryCode && {
            countryCode: formData.countryCode,
          }),
        }),
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.details?.message || data.message || "Authentication failed";
        throw new Error(errorMessage);
      }

      if (response.ok && isLogin) {
        // Handle login success
        const { accessToken, userId, accessTokenExpTime } = data.details.data;

        Cookies.set("accessToken", accessToken, {
          expires: new Date(accessTokenExpTime * 1000),
          secure: true,
          sameSite: "Strict",
        });

        Cookies.set("userId", userId, {
          expires: new Date(accessTokenExpTime * 1000),
          secure: true,
          sameSite: "Strict",
        });
        navigate("/home");
        // navigate(location.state?.from?.pathname || "/home");
      } else {
        setTimeout(() => {
          dispatch(toggleAuthMode(true));
          dispatch(resetForm());
        }, 2000);
      }
      if (response.ok && !isLogin) {
        // Handle signup success
        dispatch(setShowSuccessMsg(true));
        dispatch(resetForm());
      }
    } catch (error) {
      dispatch(setErrors({ general: error.message }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    dispatch(resetForm());
  }, [isLogin, dispatch]);

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      dispatch(setErrors({}));
      dispatch(setLoading(false));
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Success Modal */}
      {showSuccessMsg && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-green-600">Success!</h3>
              <button
                onClick={() => {
                  dispatch(setShowSuccessMsg(false));
                  dispatch(toggleAuthMode(true)); // Switch back to login
                }}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              You've successfully registered! Please sign in to continue.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  dispatch(setShowSuccessMsg(false));
                  dispatch(toggleAuthMode(true));
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-600">
            {isLogin ? "Sign in to continue" : "Get started with your account"}
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <FiMail className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  dispatch(
                    updateFormField({ field: "email", value: e.target.value })
                  )
                }
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-200 focus:border-orange-500"
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          {/* Signup-only Fields */}
          {!isLogin && (
            <>
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-gray-600 font-medium">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute top-3 left-3 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          dispatch(
                            updateFormField({
                              field: "firstName",
                              value: e.target.value,
                            })
                          )
                        }
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-200 focus:border-orange-500"
                        }`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute top-3 left-3 text-gray-400" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          dispatch(
                            updateFormField({
                              field: "lastName",
                              value: e.target.value,
                            })
                          )
                        }
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none ${
                          errors.lastName
                            ? "border-red-500"
                            : "border-gray-200 focus:border-orange-500"
                        }`}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="text"
                      value={formData.middleName}
                      onChange={(e) =>
                        dispatch(
                          updateFormField({
                            field: "middleName",
                            value: e.target.value,
                          })
                        )
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-gray-600 font-medium">
                  Contact Information
                </h3>

                {/* Signup-only Fields */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country Code
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute top-3 left-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="+1"
                        value={formData.countryCode}
                        onChange={(e) =>
                          dispatch(
                            updateFormField({
                              field: "countryCode",
                              value: e.target.value,
                            })
                          )
                        }
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none ${
                          errors.countryCode
                            ? "border-red-500"
                            : "border-gray-200 focus:border-orange-500"
                        }`}
                      />
                    </div>
                    {errors.countryCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.countryCode}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute top-3 left-3 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        inputMode="numeric"
                        aria-label="Phone number"
                        pattern="[0-9]*"
                        onChange={(e) =>
                          dispatch(
                            updateFormField({
                              field: "phone",
                              value: e.target.value.replace(/\D/g, ""),
                            })
                          )
                        }
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none ${
                          errors.phone
                            ? "border-red-500"
                            : "border-gray-200 focus:border-orange-500"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Password Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <FiLock className="absolute top-3 left-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    dispatch(
                      updateFormField({
                        field: "password",
                        value: e.target.value,
                      })
                    )
                  }
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-200 focus:border-orange-500"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => dispatch(togglePasswordVisibility())}
                  className="absolute top-3 right-3 text-gray-400 hover:text-orange-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <FiLock className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      dispatch(
                        updateFormField({
                          field: "confirmPassword",
                          value: e.target.value,
                        })
                      )
                    }
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300 focus:border-orange-500"
                    }`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300 font-medium cursor-pointer"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>

          {/* SignUp/ SignIn Toggle Link */}
          <div className="text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => dispatch(toggleAuthMode(false))}
                  className="text-orange-500 hover:text-orange-600 hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => dispatch(toggleAuthMode(true))}
                  className="text-orange-500 hover:text-orange-600 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
