import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/useAuth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SignUp = () => {
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [gotError, setGotError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const navigate = useNavigate();
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
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${BACKEND_URL}/api/v1/auth/signup`, formData)
      .then(() => {
        navigate("/verification", { state: { email: formData.email } });
      })
      .catch((error) => {
        setGotError(true);
        if (error.response.status == 400) {
          setGotError(true);
          setErrorMessage("An account with this email already exists.");
          return;
        }
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          console.error(error);
          setErrorMessage("Something went wrong. Please try again later.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleLogIn = () => {
    setIsLoadingGoogle(true);
    googleLogin();
    setIsLoadingGoogle(false);
  };
  return (
    <div className="h-screen flex flex-row-reverse">
      <div className="hidden md:block flex-1 h-full bg-gray-50">
        <img src="backdrop11.jpg" className="h-full object-cover" />
      </div>
      <div className="flex-1 flex justify-center items-center h-full p-4 ">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold mb-3">Sign Up</h1>
            <p className="text-gray-400">
              Join us today! Creating an account is fast and easy.
            </p>
          </div>
          <button
            className={`${
              isLoadingGoogle ? "bg-gray-100" : ""
            } cursor-pointer px-4 py-2 w-full rounded-full border inline-flex justify-center items-center border-gray-300 hover:bg-[#44443b] hover:border-[#44443b] hover:text-white transition duration-200 cursor-pointers`}
            onClick={handleGoogleLogIn}
            disabled={isLoadingGoogle}
          >
            {isLoadingGoogle ? (
              <PulseLoader />
            ) : (
              <div className="relative flex justify-start items-center w-full">
                <div className="absolute left-0">
                  <FontAwesomeIcon
                    icon={faGoogle}
                    className="justify-self-start"
                  />
                </div>
                <div className="mx-auto">
                  <span className="justify-self-center">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <label className="flex flex-col w-full">
                <span className="text-sm text-gray-500">
                  First Name <span className="text-red-400">*</span>
                </span>
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  className="p-2 border rounded-md w-full"
                  onChange={handleChange}
                />
              </label>
              <label className="flex flex-col w-full">
                <span className="text-sm text-gray-500">
                  Last Name <span className="text-red-400">*</span>
                </span>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  className="p-2 border rounded-md w-full"
                  onChange={handleChange}
                />
              </label>
            </div>
            <label className="flex flex-col w-full mb-2">
              <span className="text-sm text-gray-500">
                Email <span className="text-red-400">*</span>
              </span>
              <input
                name="email"
                type="email"
                value={formData.email}
                className="p-2 border rounded-md w-full"
                onChange={handleChange}
              />
            </label>
            <label className="flex flex-col w-full mb-2">
              <span className="text-sm text-gray-500">
                Password <span className="text-red-400">*</span>
              </span>
              <input
                name="password"
                type="password"
                value={formData.password}
                className="p-2 border rounded-md w-full"
                onChange={handleChange}
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
              {isLoading ? <PulseLoader color="#ffffff" /> : "Sign Up"}
            </button>
            {gotError ? (
              <p className="text-sm text-center text-red-500">{errorMessage}</p>
            ) : (
              ""
            )}
            <p className="text-xs text-gray-500 text-center mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-[#3B3B1A]">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
