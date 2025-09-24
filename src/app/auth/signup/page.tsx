import Link from "next/link";
import SignUpForm from "./signUpForm";

const SignUpPage = () => {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <SignUpForm/>
        <div> Already have an account? <Link className="text-red-600" href={"/auth/login"}>log in</Link></div>
        </div>
        )
};


export default SignUpPage;