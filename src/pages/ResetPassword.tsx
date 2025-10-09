import * as RadixInput from "../components/Input";
import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
const ResetPassword = () => {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
          SubTracker
        </h1>
        <Link to="/auth/forgot-password" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mb-2">
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back
        </Link>
        <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
          Create a new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your new password must be different from previously used passwords
        </p>
      </div>
      <RadixInput.Root className="mt-8 ">
        <RadixInput.Field name="password">
          <RadixInput.Label>New password</RadixInput.Label>
          <RadixInput.Control
            id="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="New password"
            minLength={8}
          />
        </RadixInput.Field>
        <RadixInput.Field name="confirmPassword">
          <RadixInput.Label>Confirm password</RadixInput.Label>
          <RadixInput.Control
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Confirm new password"
            minLength={8}
          />
        </RadixInput.Field>
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all disabled:opacity-70"
          >
            Reset Password
          </button>
        </div>
      </RadixInput.Root>
    </div>
  );
};

export default ResetPassword;