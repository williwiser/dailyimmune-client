import axios from "axios";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import PulseLoader from "react-spinners/PulseLoader";

interface FormData {
  email: string;
}

interface ValidationErrors {
  email?: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ForgotPassword = () => {
  const [formData, setFormData] = useState<FormData>({ email: "" });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false });

  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    if (email.length > 254) {
      return "Email is too long";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    const emailError = validateEmail(formData.email);

    if (emailError) {
      errors.email = emailError;
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
    if (touched.email && name === "email") {
      const emailError = validateEmail(value);
      setValidationErrors((prev) => ({
        ...prev,
        email: emailError,
      }));
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate on blur
    if (field === "email") {
      const emailError = validateEmail(formData.email);
      setValidationErrors((prev) => ({
        ...prev,
        email: emailError,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true });

    // Clear previous errors
    setSubmitError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await axios.get(
        `${BACKEND_URL}/api/v1/auth/resend-otp?email=${encodeURIComponent(
          formData.email.trim()
        )}&passwordReset=${true}`
      );
      navigate("/verification", {
        state: { email: formData.email.trim(), passwordReset: true },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          "Failed to send verification code. Please try again.";
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

  const isFormValid = !validationErrors.email && formData.email.trim() !== "";

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md border">
        <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email address and we'll send you a verification code to
          reset your password.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              value={formData.email}
              className={`p-3 border rounded-md w-full transition-colors ${
                validationErrors.email && touched.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-[#3B3B1A] focus:ring-[#3B3B1A]"
              } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
              placeholder="your@email.com"
              disabled={isLoading}
              autoComplete="email"
            />
            {validationErrors.email && touched.email && (
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
                {validationErrors.email}
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
              "Send Verification Code"
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

export default ForgotPassword;
