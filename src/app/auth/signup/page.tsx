import Link from "next/link";
import SignUpForm from "./signUpForm";

const SignUpPage = () => {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <SignUpForm/>
            <div className="m-8 text-center">
                <div className="p-2 text-gray-700">Already have an account?</div>
                
                    <Link className="text-blue-600 p-2 hover:underline font-medium" href={"/auth/login"}>Sign in</Link>
            
            </div>
        </div>
    )
};


export default SignUpPage;