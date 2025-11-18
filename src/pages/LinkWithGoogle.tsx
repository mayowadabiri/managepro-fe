

import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import * as Input from "../components/Input";
import { Link, useNavigate } from "@tanstack/react-router";
import Typography from "../components/Typography";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schema/loginSchema";
import { useLinkAccountWithGoogle, useLogin, useLoginWithGoogle } from "@/api/auth";
import { setCookie } from "@/utils/cookies";
import { useEffect } from "react";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useLocation } from '@tanstack/react-router'
interface LinkWithGoogleForm {
    password: string;
    crendential?: string;
}


const LinkWithGoogle = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            password: '',
            credential: location.state?.credential || ''
        },
        mode: "onTouched",
    });
    const { mutate } = useLinkAccountWithGoogle();

    const onSubmit = async () => {
        const payload = getValues();
        mutate(payload, {
            onSuccess: (data) => {
                setCookie(data.data.token);
                navigate({ to: "/" });
            }
        });
    }



    return (
        <div className="w-full space-y-6">

            <Typography
                component="h2"
                size="3xl"
                weight="bold"
                className="mt-6 text-gray-900"
            >
                Link Your Account with Google
            </Typography>
            <Typography
                size="sm"
                className="mt-2 text-gray-600"
            >
            </Typography>
            <Input.Root className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>

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
                <Button type="submit" width="full" className="py-3 px-4" >
                    Link with Google
                </Button>
            </Input.Root>
        </div>
    );
};

export default LinkWithGoogle;