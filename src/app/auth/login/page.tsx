import Link from "next/link";
import LogInForm from "./LogInForm";

const LogInPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <LogInForm/>
        <div className="flex flex-col items-center pt-4"> Dont have an account? 
            <Link className="text-red-600" href={"/auth/signup"}>sign up here</Link>
            </div>
        </div>
        )
};

export default LogInPage;