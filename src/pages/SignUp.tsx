import { useEffect, useState } from "react";
import Typography from "../components/Typography";
import Button from "../components/Button";
import * as RadixInput from "../components/Input";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../schema/signUpSchema";

import {
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { useSignup } from "@/api/auth";


const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutateAsync, isPending } = useSignup()
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    resolver: yupResolver(signUpSchema),
    mode: "onSubmit",
  });


  const onSubmit = async () => {
    const data = getValues();
    await mutateAsync(data)
    navigate({
      to: "/auth/otp-verification",
      state: { email: data.email }
    })
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <Typography
          component="h1"
          size="4xl"
          weight="extraBold"
          className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600"
        >
          SubTracker
        </Typography>
        <Typography
          component="h2"
          size="3xl"
          weight="bold"
          align="center"
          className="mt-6 text-gray-900"
        >
          Create a new account
        </Typography>
        <Typography size="sm" align="center" className="mt-2 text-gray-600">
          Or{" "}
          <Link
            to="/auth/login"
            className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
          >
            sign in to existing account
          </Link>
        </Typography>
      </div>
      <RadixInput.Root
        className="mt-8 space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 w-full">
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => (
              <RadixInput.Field name="first_name">
                <RadixInput.Label>First name</RadixInput.Label>
                <RadixInput.Control id="first_name" {...field} />
                {errors.first_name && <RadixInput.Error>{errors.first_name.message}</RadixInput.Error>}
              </RadixInput.Field>
            )}
          />
          <Controller
            name="last_name"
            control={control}
            render={({ field }) => (
              <RadixInput.Field name="last_name">
                <RadixInput.Label>Last name</RadixInput.Label>
                <RadixInput.Control id="last_name" {...field} />
                {errors.last_name && <RadixInput.Error>{errors.last_name.message}</RadixInput.Error>}
              </RadixInput.Field>
            )}
          />
        </div>
        <Controller
          name="email"
          control={control}
          render={({ field, formState: { errors } }) => (
            <RadixInput.Field name="email">
              <RadixInput.Label>Email address</RadixInput.Label>
              <RadixInput.Control
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                {...field}
              />
              {errors.email && <RadixInput.Error>{errors.email.message}</RadixInput.Error>}
            </RadixInput.Field>
          )}
        />
        <Controller
          name="phone_number"
          control={control}
          render={({ field }) => (
            <RadixInput.Field name="phone_number">
              <RadixInput.Label>Phone number</RadixInput.Label>
              <RadixInput.Control
                id="phone_number"
                type="tel"
                autoComplete="tel"
                required
                placeholder="+2345411938334"
                {...field}
              />
              {errors.phone_number && <RadixInput.Error>{errors.phone_number.message}</RadixInput.Error>}
            </RadixInput.Field>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <RadixInput.Field name="password">
              <RadixInput.Label>Password</RadixInput.Label>
              <RadixInput.Control
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="••••••••"
                {...field}
                trailingIcon={
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="focus:outline-none"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />
              {errors.password && <RadixInput.Error>{errors.password.message}</RadixInput.Error>}
            </RadixInput.Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <RadixInput.Field name="confirmPassword">
              <RadixInput.Label>Confirm password</RadixInput.Label>
              <RadixInput.Control
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="••••••••"
                {...field}
                trailingIcon={
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />
              {errors.password && <RadixInput.Error>{errors.password.message}</RadixInput.Error>}
            </RadixInput.Field>
          )}
        />
        <Button
          type="submit"
          width="full"
          className="py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all disabled:opacity-70"
          loading={isPending}
        >
          Create Account
        </Button>
      </RadixInput.Root>
      <div className="relative flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500 text-sm">Or continue with</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-50 transition">
          <img src="/google-icon.svg" alt="Google" className="h-5 w-5" />
          <span className="text-sm font-medium text-gray-700">Google</span>
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-50 transition"
        >
          <svg className="h-5 w-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.43.36a9 9 0 01-2.86 1.1A4.52 4.52 0 0016.1 0c-2.63 0-4.77 2.13-4.77 4.77 0 .37.04.73.12 1.07A12.82 12.82 0 013 1.64a4.77 4.77 0 001.48 6.36A4.5 4.5 0 012 7.3v.06c0 2.23 1.59 4.1 3.7 4.52a4.49 4.49 0 01-2.15.08c.6 1.88 2.35 3.24 4.42 3.28A9.05 9.05 0 012 19.54a12.77 12.77 0 006.92 2.02c8.3 0 12.84-6.87 12.84-12.82 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Twitter</span>
        </button>
      </div>
    </div>
  );
};

export default SignUp;
