import { useLocation, useNavigate, } from '@tanstack/react-router';
import Button from '../components/Button';
import Typography from '../components/Typography';
import OnetimePasswordField from '@/components/OTPInput';
import { useEffect } from 'react';
import * as Input from "@/components/Input"
import { useVerifyEmail } from '@/api/auth';
import { Controller, useForm } from 'react-hook-form';
const OTPVerification = () => {
  const { control, getValues, watch, setError } = useForm<{ code: string }>({
    mode: "onSubmit",
    defaultValues: {
      code: ''
    }
  })
  const { mutateAsync, isError, error, isPending } = useVerifyEmail()
  const navigate = useNavigate()

  const { state } = useLocation()
  const value = watch("code")
  const isDisabled = value.length !== 6

  useEffect(() => {
    if (isError) {
      setError("root", { message: error.message })
    }
  }, [isError, error, setError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutateAsync({ email: state.email!, code: getValues("code") }, {
      onSuccess: () => {
        navigate({
          to: "/auth/login"
        })
      }
    });

  };

  return <div className="mt-8 space-y-6">
    <div>
      {/* <Link to={resetMode ? '/forgot-password' : '/signup'} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
        Back
      </Link> */}
      <Typography
        component="h2"
        size="2xl"
        weight="bold"
        className="text-gray-900"
      >
        Verification Code
      </Typography>
      <Typography
        size="sm"
        className="mt-2 text-gray-600"
      >
        We've sent a 6-digit code to{' '}
        <span className="font-medium text-indigo-600">
          {state.email}
        </span>
      </Typography>
    </div>

    <Input.Root className="w-full" onSubmit={handleSubmit}>
      <Controller
        name="code"
        control={control}
        rules={{
          minLength: {
            value: 6,
            message: "Code must be 6 digits"
          },
        }}
        render={({ field, formState: { errors } }) => (
          <div className='w-full'>
            <OnetimePasswordField value={field.value} onValueChange={field.onChange} />
            <Input.Field name='code'>
              {errors.code && <Input.Error>{errors.code.message}</Input.Error>}
              {errors.root && <Input.Error>{errors.root.message}</Input.Error>}
            </Input.Field>
          </div>
        )}
      />


      <div className="text-center">
        <Typography size="sm" className="text-gray-600">
          Didn't receive the code?{' '}
          <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">
            Resend
          </button>
        </Typography>
      </div>
      <Button
        loading={isPending}
        disabled={isDisabled}
        type="submit"
        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
      >
        Verify
      </Button>
    </Input.Root>
  </div>
};
export default OTPVerification;