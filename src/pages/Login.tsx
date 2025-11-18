

import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import * as Input from "../components/Input";
import { Link, useNavigate } from "@tanstack/react-router";
import Typography from "../components/Typography";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schema/loginSchema";
import { useLogin, useLoginWithGoogle } from "@/api/auth";
import { setCookie } from "@/utils/cookies";
import { useEffect } from "react";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { ApiError } from "@/types/apiResponse";

const Login = () => {
  const navigate = useNavigate()
  const { mutateAsync: mutateGoogle, isPending: isGoogleLoginPending, isError, error } = useLoginWithGoogle()

  const { mutate, isPending, data, isSuccess, isError: isLoginError, error: loginError } = useLogin();
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (isLoginError) {
      setError("root", { message: (loginError as ApiError).message })
    }
  }, [isLoginError])


  const handleOnError = (error: ApiError, { credential }: { credential: string }) => {
    const err = error as ApiError;
    if (err.code === "ACCOUNT_EXISTS_NEEDS_LINKING") {
      navigate({
        to: "/auth/link-with-google",
        state: { credential: credential }
      })
    }
  }
  useEffect(() => {
    if (isSuccess) {
      setCookie(data?.data.token);
      navigate({ to: "/" });
    }
  }, [isSuccess]);

  const onSubmit = async () => {
    const payload = getValues();
    mutate(payload);
  };

  useGoogleOneTapLogin({
    onSuccess: async (response) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const credential = response.credential!;
      const data = await mutateGoogle({ credential }, {
        onError: handleOnError
      })
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
      <div className="">
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
          className="mt-6 text-gray-900"
        >
          Sign in to your account
        </Typography>
        <Typography
          size="sm"
          className="mt-2 text-gray-600"
        >
          Or{" "}
          <Link
            to="/auth/signup"
            className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
          >
            create a new account
          </Link>
        </Typography>
      </div>
      {errors.root && (
        <span className="text-sm text-red-600 text-center block">{errors.root.message}</span>
      )}
      <Input.Root className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input.Field name="email">
              <Input.Label>Email address</Input.Label>
              <Input.Control
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                {...field}
              />
              {errors.email && (
                <span className="text-xs text-red-600 mt-1">{errors.email.message}</span>
              )}
            </Input.Field>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Field name="password">
              <Input.Label>Password</Input.Label>
              <Input.Control
                id="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                {...field}
              />
              {errors.password && (
                <span className="text-xs text-red-600 mt-1">{errors.password.message}</span>
              )}
            </Input.Field>
          )}
        />
        <div className="flex items-center justify-between w-full">
          <Checkbox id="remember-me" label="Remember me" />
          <div className="text-sm">
            <Link to="/auth/forgot-password" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
              Forgot your password?
            </Link>
          </div>
        </div>
        <Button type="submit" width="full" className="py-3 px-4" disabled={isLoading} loading={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </Input.Root>
    </div>
  );
};

export default Login;