import { useEffect, useState } from "react";
import Typography from "../components/Typography";
import Button from "../components/Button";
import * as RadixInput from "../components/Input";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../schema/signUpSchema";
import { FcGoogle } from "react-icons/fc";
import { useGoogleOneTapLogin } from '@react-oauth/google';

import {
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { useLoginWithGoogle, useSignup } from "@/api/auth";
import { setCookie } from "@/utils/cookies";


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
  const { mutateAsync: mutateGoogle, isPending: isGoogleLoginPending } = useLoginWithGoogle()


  const onSubmit = async () => {
    const data = getValues();
    await mutateAsync(data)
    navigate({
      to: "/auth/otp-verification",
      state: { email: data.email }
    })
  };

  useGoogleOneTapLogin({
    onSuccess: async (response) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const credential = response.credential!;
      const data = await mutateGoogle({ credential })
      setCookie(data?.data.token);
      navigate({ to: "/" });
    },
    onError: () => {
      console.log('Login Failed');
    },
    cancel_on_tap_outside: false,
  })

  const isLoading = isPending || isGoogleLoginPending;

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
          loading={isLoading}
        >
          Create Account
        </Button>
      </RadixInput.Root>

    </div>
  );
};

export default SignUp;
