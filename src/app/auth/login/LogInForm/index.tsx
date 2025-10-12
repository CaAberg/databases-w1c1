'use client'
import {LogIn} from "@/../actions/log-in"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { logInSchema } from "../../../../../actions/schemas"
import ErrorMessage from "@/app/components/ErrorMessage"
import { useMutation } from "@tanstack/react-query"



const LogInForm = () => {

const {
  register,
   handleSubmit,
   formState: {errors}} = useForm({
    resolver: zodResolver(logInSchema)
})

const {mutate, isPending, error} = useMutation({
  mutationFn: LogIn,
})

  return (
    <>
    <form onSubmit={handleSubmit (values => mutate(values))} className=" border-1 rounded-xl p-4 flex flex-col w-3xl mx-auto">
        <h2>Log in!</h2>
        <fieldset>
            <label htmlFor="email">Enter your Email</label>
            <input type="text" {...register("email")} id="email" className="border-1 rounded-md p-2 w-full"/>
            {errors.email && <ErrorMessage message={errors.email.message!}/>}
        </fieldset>
        <fieldset className="mt-4">
            <label htmlFor="password">Password</label>
            <input type="password" {...register("password")} id="password" className="border-1 rounded-md p-2 w-full"/>
            {errors.password && <ErrorMessage message={errors.password.message!}/>}
        </fieldset>
        <button className="bg-blue-500 text-white rounded-md p-2 mt-4 w-full">{isPending? "Logging you in!" : "Log In"} </button>
        {error && <ErrorMessage message={error.message}/>}
    </form>
    </>
  )
}   

export default LogInForm;