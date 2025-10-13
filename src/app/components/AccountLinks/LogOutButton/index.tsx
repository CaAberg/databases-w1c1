'use client'

import { LogOut } from "../../../../../actions/log-out";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LogOutButton = () => {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    const handleClick = async () => {
        setIsLoggingOut(true);
        toast.loading("Logging out...", { id: "logout" });
        
        try {
            const result = await LogOut();
            
            if (result.success) {
                toast.success("Logged out successfully!", { id: "logout" });
                router.push("/");
            } else {
                toast.error(`Failed to log out: ${result.error}`, { id: "logout" });
            }
        } catch (error) {
            toast.error("Failed to log out", { id: "logout" });
        } finally {
            setIsLoggingOut(false);
        }
    }
    
    return (
        <button 
            onClick={handleClick}
            disabled={isLoggingOut}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoggingOut ? "Logging out..." : "log out"}
        </button>
    )
}

export default LogOutButton;