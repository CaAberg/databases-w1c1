'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "../../../../../actions/sign-up";
import { signUpSchema } from "../../../../../actions/schemas";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "@/app/components/ErrorMessage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const router = useRouter();

  const {
        register,
        handleSubmit,
        formState: { errors } 
      }= useForm ({
      resolver: zodResolver(signUpSchema)
      })

      const {mutate, error, isPending} = useMutation({
        mutationFn: signUp,
        onMutate: () => {
          toast.loading("Creating your account...", { id: "signup" });
        },
        onSuccess: (result) => {
          if (result.success) {
            toast.success("Account created successfully! Welcome!", { id: "signup" });
            router.push("/");
          } else {
            toast.error(`Signup failed: ${result.error}`, { id: "signup" });
          }
        },
        onError: (error) => {
          toast.error(`Signup failed: ${error.message}`, { id: "signup" });
        }
      })
    

  return (
    <div className="w-full max-w-md mx-auto">
      <form 
        onSubmit={handleSubmit(values => mutate(values))} 
        className="bg-white shadow-lg rounded-xl p-8 border border-gray-200"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join our community today</p>
        </div>

        <div className="space-y-6">
          <fieldset>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              {...register("email")} 
              id="email" 
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
            {errors.email && <ErrorMessage message={errors.email.message!}/>}
          </fieldset>

          <fieldset>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input 
              type="text" 
              {...register("username")} 
              id="username" 
              placeholder="Choose a username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
            {errors.username && <ErrorMessage message={errors.username.message!}/>}
          </fieldset>

          <fieldset>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input 
              type="password" 
              {...register("password")} 
              id="password" 
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
            {errors.password && <ErrorMessage message={errors.password.message!}/>}
          </fieldset>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full mt-8 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isPending ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>

        {error && (
          <div className="mt-4">
            <ErrorMessage message={error.message}/>
          </div>
        )}
      </form>
    </div>
  )
}

export default SignUpForm;