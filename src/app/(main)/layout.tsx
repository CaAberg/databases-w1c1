import React from "react";
import Header from "../components/header";


const MainLayout = ({
     children,
     }: Readonly<{ 
        children: React.ReactNode 
    }>) => {
    return (
        <div className="min-h-screen bg-gray-100">
        <Header/>
        <main className="p-4">
            {children}
        </main>
    </div>
    );
}

export default MainLayout;