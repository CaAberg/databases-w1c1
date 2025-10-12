'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "../../../../../actions/sign-up";
import { signUpSchema } from "../../../../../actions/schemas";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "@/app/components/ErrorMessage";

const SignUpForm = () => {
  const {
        register,
        handleSubmit,
        formState: { errors } 
      }= useForm ({
      resolver: zodResolver(signUpSchema)
      })

      const {mutate, error} = useMutation({
        mutationFn: signUp
      })
    

  return (
    <>
    <form onSubmit= {handleSubmit(values => mutate(values))} className=" border-1 rounded-xl p-4 flex flex-col w-3xl mx-auto">
        <h2>Sign up</h2>
        <fieldset>
            <label htmlFor="email">Email</label>
            <input type="text" {...register("email")} id="email" className="border-1 rounded-md p-2 w-full"/>
            {errors.email && <ErrorMessage message={errors.email.message!}/>}

            <label htmlFor="username">Username</label>
            <input type="text" {...register("username")} id="username" className="border-1 rounded-md p-2 w-full"/>
            {errors.username && <ErrorMessage message={errors.username.message!}/>}

            <label htmlFor="password">Password</label>
            <input type="password" {...register("password")} id="password" className="border-1 rounded-md p-2 w-full"/>
            {errors.password && <ErrorMessage message={errors.password.message!}/>}
            
        </fieldset>
        <button type="submit" className="bg-blue-500 text-white rounded-md p-2 mt-4 w-full">Sign up</button>
        {error && <ErrorMessage message={error.message}/>}
    </form>
    </>
  )
}

export default SignUpForm;