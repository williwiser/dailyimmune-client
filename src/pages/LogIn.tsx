import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import { useGoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/context/useAuth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const LogIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [gotError, setGotError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const { refetchUser } = useAuth();
  const location = useLocation();
  const { verified, passwordReset } = location.state || {};

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      console.log("codeResponse " + codeResponse.code);
      setIsLoadingGoogle(true);
      const tokens = await axios.post(
        `${BACKEND_URL}/api/v1/auth/google`,
        {
          code: codeResponse.code,
        },
        { withCredentials: true }
      );
      console.log(tokens.data);
      setIsLoadingGoogle(false);
      await refetchUser();
      navigate("/dashboard");
    },
    onError: (errorResponse) => console.log(errorResponse),
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogIn = () => {
    setIsLoadingGoogle(true);
    googleLogin();
    setIsLoadingGoogle(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/v1/auth/login`, formData, {
        withCredentials: true,
      });
      await refetchUser();
      navigate("/dashboard");
    } catch (error) {
      setGotError(true);
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (verified) toast.success("Email verified successfully!");
  }, [verified]);

  useEffect(() => {
    if (passwordReset) toast.success("Password reset succesfully!");
  }, [passwordReset]);
  return (
    <div className="h-screen flex flex-row-reverse">
      <Toaster />
      <div className="hidden md:block flex-1 h-full bg-gray-50">
        <img src="/backdrop7.jpg" className="h-full object-cover" />
      </div>
      <div className="flex-1 flex justify-center items-center h-full p-4 ">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold mb-3">Log In</h1>
            <p className="text-gray-400">
              Welcome back! Enter your details to continue.
            </p>
          </div>
          <button
            className={`${
              isLoadingGoogle ? "bg-gray-100" : ""
            } px-4 py-2 rounded-full border inline-flex justify-center items-center text-gray-500 border-gray-300  hover:bg-[#44443b] hover:border-[#44443b] hover:text-white transition duration-200 cursor-pointer w-full`}
            onClick={handleGoogleLogIn}
            disabled={isLoadingGoogle}
          >
            {isLoadingGoogle ? (
              <PulseLoader />
            ) : (
              <div className="relative flex justify-start items-center w-full  ">
                <div className="absolute left-0">
                  <FontAwesomeIcon
                    icon={faGoogle}
                    className="justify-self-start"
                  />
                </div>
                <div className="mx-auto">
                  <span className="justify-self-center w-full">
                    Continue with Google
                  </span>
                </div>
              </div>
            )}
          </button>

          <div className="flex items-center gap-1 text-xs text-gray-400 my-6">
            <hr className="w-full" />
            or
            <hr className="w-full" />
          </div>
          <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
            <label className="flex flex-col w-full">
              <span className="text-sm text-gray-500">
                Email <span className="text-red-400">*</span>
              </span>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                value={formData.email}
                className="p-2 border rounded-md w-full mb-4"
              />
            </label>
            <label className="flex flex-col w-full">
              <span className="text-sm text-gray-500">
                Password <span className="text-red-400">*</span>
              </span>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                value={formData.password}
                className="p-2 border rounded-md w-full"
              />
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-gray-500 hover:text-gray-800 transition-all duration-200 mb-4"
            >
              Forgot password?
            </Link>
            <button
              type="submit"
              className={`inline-flex justify-center items-center px-4 py-2 min-h-[2.6rem] rounded-md border  ${
                isLoading
                  ? "bg-[#858570] border-[#858570] cursor-progress"
                  : "bg-[#3B3B1A] border-[#3B3B1A] cursor-pointer hover:bg-[#5a5a3b]"
              } text-white w-full transition-colors duration-200 `}
              disabled={isLoading}
            >
              {isLoading ? <PulseLoader color="#ffffff" /> : "Log In"}
            </button>
            {gotError ? (
              <p className="text-sm text-center text-red-500">{errorMessage}</p>
            ) : (
              ""
            )}
            <p className="text-xs text-gray-500 text-center mt-2">
              New here?{" "}
              <Link to="/signup" className="text-[#3B3B1A]">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
