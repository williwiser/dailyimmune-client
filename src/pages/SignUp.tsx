import AuthLayout from "@/layouts/AuthLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [gotError, setGotError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${BACKEND_URL}/api/v1/auth/signup`, formData)
      .then((response) => {
        if (response.status == 400) {
          setGotError(true);
          setErrorMessage("An account with this email already exists.");
          return;
        }
        navigate("/activation-link");
      })
      .catch((error) => {
        setGotError(true);
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(error.response.data.error);
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

  const handleGoogleSignUp = () => {};
  return (
    <AuthLayout title="Sign Up">
      <button
        className="px-4 py-2 rounded-md border border-gray-300 hover:bg-[#3B3B1A] hover:border-[#3B3B1A] hover:text-white transition duration-200"
        onClick={handleGoogleSignUp}
      >
        <div className="flex gap-2 items-center justify-center">
          <FontAwesomeIcon icon={faGoogle} />
          <span>Sign up with Google</span>
        </div>
      </button>
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <hr className="w-full" />
        or
        <hr className="w-full" />
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="flex flex-col w-full">
            <span className="text-sm text-gray-500">
              First Name <span className="text-red-400">*</span>
            </span>
            <input
              name="firstName"
              type="text"
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
              className="p-2 border rounded-md w-full"
              onChange={handleChange}
            />
          </label>
        </div>
        <label className="flex flex-col w-full">
          <span className="text-sm text-gray-500">
            Email <span className="text-red-400">*</span>
          </span>
          <input
            name="email"
            type="email"
            className="p-2 border rounded-md w-full"
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-col w-full">
          <span className="text-sm text-gray-500">
            Password <span className="text-red-400">*</span>
          </span>
          <input
            name="password"
            type="password"
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
    </AuthLayout>
  );
};

export default SignUp;
