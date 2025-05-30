import AuthLayout from "@/layouts/AuthLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router";

const LogIn = () => {
  const handleSubmit = () => {};
  const handleGoogleSignIn = () => {};
  return (
    <AuthLayout title="Log In">
      <button
        className="px-4 py-2 rounded-md border border-gray-300 hover:bg-[#3B3B1A] hover:border-[#3B3B1A] hover:text-white transition duration-200"
        onClick={handleGoogleSignIn}
      >
        <div className="flex gap-2 items-center justify-center">
          <FontAwesomeIcon icon={faGoogle} />
          <span>Sign in with Google</span>
        </div>
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
          Log In
        </button>
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
