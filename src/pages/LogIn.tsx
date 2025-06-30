import AuthLayout from "@/layouts/AuthLayout";
import { Link, useNavigate } from "react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import { useAuth } from "@/context/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const LogIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [gotError, setGotError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

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
      setUser(tokens.data);
      setIsLoadingGoogle(false);
      navigate("/dashboard");
    },
    onError: (errorResponse) => console.log(errorResponse),
  });
  const [isLoading, setIsLoading] = useState(false);

  const { user, setUser } = useAuth();

  const navigate = useNavigate();

  const handleGoogleLogIn = () => {
    setIsLoadingGoogle(true);
    googleLogin();
    setIsLoadingGoogle(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${BACKEND_URL}/api/v1/auth/login`, formData, {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
        console.log(user);
        navigate("/dashboard");
      })
      .catch((error) => {
        setGotError(true);
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Something went wrong. Please try again later.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AuthLayout title="Log In">
      <button
        className={`${
          isLoadingGoogle ? "bg-gray-100" : ""
        } px-4 py-2 rounded-md border inline-flex justify-center items-center border-gray-300 hover:bg-[#3B3B1A] hover:border-[#3B3B1A] hover:text-white transition duration-200 cursor-pointer`}
        onClick={handleGoogleLogIn}
        disabled={isLoadingGoogle}
      >
        {isLoadingGoogle ? (
          <PulseLoader />
        ) : (
          <div className="relative flex justify-start items-center w-full">
            <div className="absolute left-0">
              <FontAwesomeIcon icon={faGoogle} className="justify-self-start" />
            </div>
            <div className="mx-auto">
              <span className="justify-self-center">Continue with Google</span>
            </div>
          </div>
        )}
      </button>

      <div className="flex items-center gap-1 text-xs text-gray-400">
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
            className="p-2 border rounded-md w-full"
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
        <button
          type="submit"
          className={`inline-flex justify-center items-center px-4 py-2 min-h-[2.6rem] rounded-md border  ${
            isLoading
              ? "bg-[#858570] border-[#858570]"
              : "bg-[#3B3B1A] border-[#3B3B1A]"
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
    </AuthLayout>
  );
};

export default LogIn;
