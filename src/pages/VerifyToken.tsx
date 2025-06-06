import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router";
import AuthLayout from "@/layouts/AuthLayout";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const VerifyToken = () => {
  const [searchParams] = useSearchParams();
  const [activationSuccessful, setActivationSuccessful] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const token = searchParams.get("token");
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/auth/verify-email?token=${token}`)
      .then((response) => {
        console.log(response);
        if (response.status == 201) {
          setActivationSuccessful(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setActivationSuccessful(false);
      });
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRedirect(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <AuthLayout
      title={
        activationSuccessful
          ? "Your account is now activated!"
          : "There seems to be an error"
      }
    >
      {activationSuccessful ? (
        <div className="flex flex-col  items-center gap-3">
          <p className="text-gray-500">Redirecting you to login...</p>
          {shouldRedirect ? <Navigate to="/login" /> : ""}
          <PulseLoader color="#6b7280" />
        </div>
      ) : (
        <div className="flex flex-col gap-3 text-center">
          <p className="text-gray-500">Resend activation link</p>
        </div>
      )}
    </AuthLayout>
  );
};

export default VerifyToken;
