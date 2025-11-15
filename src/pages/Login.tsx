

import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import * as Input from "../components/Input";
import { Link, useNavigate } from "@tanstack/react-router";
import Typography from "../components/Typography";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schema/loginSchema";
import { useLogin } from "@/api/auth";
import { setCookie } from "@/utils/cookies";
import { useEffect } from "react";
import { useGoogleOneTapLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate()
  const { mutate, isPending, data, isSuccess } = useLogin();
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  });

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

  const login = useGoogleOneTapLogin({
    onSuccess: response => {
      console.log(response);
    },
    onError: () => {
      console.log('Login Failed');
    },
  })

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
        <Button type="submit" width="full" className="py-3 px-4" disabled={isPending} loading={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </Input.Root>
    </div>
  );
};

export default Login;