import axios from "axios";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import PulseLoader from "react-spinners/PulseLoader";

interface FormData {
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  password?: string;
  confirmPassword?: string;
}

interface LocationState {
  email?: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ResetPassword = () => {
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as LocationState)?.email;

  // Redirect if no email is provided
  if (!email) {
    navigate("/forgot-password");
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (password.length > 128) {
      return "Password is too long (max 128 characters)";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return undefined;
  };

  const validateConfirmPassword = (
    confirmPassword: string
  ): string | undefined => {
    if (!confirmPassword) {
      return "Please confirm your password";
    }
    if (confirmPassword !== formData.password) {
      return "Passwords do not match";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword
    );

    if (passwordError) {
      errors.password = passwordError;
    }
    if (confirmPasswordError) {
      errors.confirmPassword = confirmPasswordError;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError("");
    }

    // Real-time validation for touched fields
    if (touched[name as keyof typeof touched]) {
      if (name === "password") {
        const passwordError = validatePassword(value);
        setValidationErrors((prev) => ({
          ...prev,
          password: passwordError,
          // Re-validate confirm password if it's been touched
          ...(touched.confirmPassword && {
            confirmPassword: validateConfirmPassword(formData.confirmPassword),
          }),
        }));
      } else if (name === "confirmPassword") {
        const confirmPasswordError = validateConfirmPassword(value);
        setValidationErrors((prev) => ({
          ...prev,
          confirmPassword: confirmPasswordError,
        }));
      }
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate on blur
    if (field === "password") {
      const passwordError = validatePassword(formData.password);
      setValidationErrors((prev) => ({
        ...prev,
        password: passwordError,
      }));
    } else if (field === "confirmPassword") {
      const confirmPasswordError = validateConfirmPassword(
        formData.confirmPassword
      );
      setValidationErrors((prev) => ({
        ...prev,
        confirmPassword: confirmPasswordError,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ password: true, confirmPassword: true });

    // Clear previous errors
    setSubmitError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log(email);
      await axios.post(`${BACKEND_URL}/api/v1/auth/reset-password`, {
        email: email,
        password: formData.password,
      });

      // Show success message and redirect to login
      navigate("/login", {
        state: {
          passwordReset: true,
          message:
            "Password reset successfully! Please log in with your new password.",
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          "Failed to reset password. Please try again.";
        setSubmitError(
          typeof errorMessage === "string" ? errorMessage : "An error occurred"
        );
      } else {
        setSubmitError(
          "Network error. Please check your connection and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    !validationErrors.password &&
    !validationErrors.confirmPassword &&
    formData.password !== "" &&
    formData.confirmPassword !== "";

  const getPasswordStrength = (
    password: string
  ): { strength: string; color: string } => {
    if (!password) return { strength: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password)) strength++;

    if (strength <= 2) return { strength: "Weak", color: "bg-red-500" };
    if (strength <= 4) return { strength: "Medium", color: "bg-yellow-500" };
    return { strength: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md border">
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Create a new strong password for your account.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="password"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                value={formData.password}
                className={`p-3 border rounded-md w-full pr-10 transition-colors ${
                  validationErrors.password && touched.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-[#3B3B1A] focus:ring-[#3B3B1A]"
                } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                placeholder="Enter your new password"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {formData.password && !validationErrors.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">
                    Password strength:
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength.strength === "Weak"
                        ? "text-red-600"
                        : passwordStrength.strength === "Medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {passwordStrength.strength}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${passwordStrength.color}`}
                    style={{
                      width:
                        passwordStrength.strength === "Weak"
                          ? "33%"
                          : passwordStrength.strength === "Medium"
                          ? "66%"
                          : "100%",
                    }}
                  />
                </div>
              </div>
            )}

            {validationErrors.password && touched.password && (
              <p className="text-sm text-red-500 mt-1 flex items-start">
                <svg
                  className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {validationErrors.password}
              </p>
            )}

            {!validationErrors.password &&
              touched.password &&
              formData.password && (
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p className="font-medium">Password requirements:</p>
                  <ul className="space-y-0.5 ml-4">
                    <li className="flex items-center">
                      <span className="text-green-600 mr-1">✓</span>
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-1">✓</span>
                      Contains uppercase and lowercase letters
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-1">✓</span>
                      Contains at least one number
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-1">✓</span>
                      Contains at least one special character
                    </li>
                  </ul>
                </div>
              )}
          </div>

          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                onChange={handleChange}
                onBlur={() => handleBlur("confirmPassword")}
                value={formData.confirmPassword}
                className={`p-3 border rounded-md w-full pr-10 transition-colors ${
                  validationErrors.confirmPassword && touched.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-[#3B3B1A] focus:ring-[#3B3B1A]"
                } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                placeholder="Confirm your new password"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {validationErrors.confirmPassword && touched.confirmPassword && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {validationErrors.confirmPassword}
              </p>
            )}
            {!validationErrors.confirmPassword &&
              touched.confirmPassword &&
              formData.confirmPassword && (
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Passwords match
                </p>
              )}
          </div>

          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 flex items-start">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {submitError}
              </p>
            </div>
          )}

          <button
            type="submit"
            className={`inline-flex justify-center items-center px-4 py-3 min-h-[2.8rem] rounded-md border font-medium ${
              isLoading || !isFormValid
                ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                : "bg-[#3B3B1A] border-[#3B3B1A] cursor-pointer hover:bg-[#5a5a3b] active:bg-[#2a2a15]"
            } text-white w-full transition-colors duration-200`}
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <PulseLoader color="#ffffff" size={8} />
            ) : (
              "Reset Password"
            )}
          </button>

          <div className="mt-6 text-center">
            <Link
              type="button"
              to="/login"
              className="text-sm text-[#3B3B1A] hover:underline focus:outline-none"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
