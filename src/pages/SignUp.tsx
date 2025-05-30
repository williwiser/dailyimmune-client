import AuthLayout from "@/layouts/AuthLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router";

const SignUp = () => {
  const handleSubmit = () => {};
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
            />
          </label>
        </div>
        <label className="flex flex-col w-full">
          <span className="text-sm text-gray-500">
            Email <span className="text-red-400">*</span>
          </span>
          <input
            name="email"
            type="text"
            className="p-2 border rounded-md w-full"
          />
        </label>
        <label className="flex flex-col w-full">
          <span className="text-sm text-gray-500">
            Password <span className="text-red-400">*</span>
          </span>
          <input
            name="password"
            type="text"
            className="p-2 border rounded-md w-full"
          />
        </label>
        <button
          type="submit"
          className="px-4 py-2 rounded-md border border-[#3B3B1A] bg-[#3B3B1A] text-white w-full"
        >
          Sign Up
        </button>
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
