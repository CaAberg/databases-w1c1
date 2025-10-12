'use client'

import { LogOut } from "../../../../../actions/log-out";

const LogOutButton = () => {
    const handleClick = async () => {
    LogOut();
        
    }
    return (
        <button onClick={handleClick}> log out</button>
    )
}

export default LogOutButton;