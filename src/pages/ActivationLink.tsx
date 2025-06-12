import AuthLayout from "@/layouts/AuthLayout";

const ActivationLink = () => {
  const handleResendLink = () => {};
  return (
    <AuthLayout title="We've Sent You a Link!">
      <div className="text-center text-gray-500 flex flex-col gap-3">
        <p className="text-gray-500">
          We've sent an activation link to your inbox.
        </p>
        <hr />
        <p className="text-xs">
          Can't find it? Check your spam folder or{" "}
          <button onClick={handleResendLink} className="text-[#3B3B1A]">
            resend the link
          </button>
          .
        </p>
      </div>
    </AuthLayout>
  );
};

export default ActivationLink;
