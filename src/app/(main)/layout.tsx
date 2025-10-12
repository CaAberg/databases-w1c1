import React from "react";
import Header from "../components/header";


const MainLayout = ({
     children,
     }: Readonly<{ 
        children: React.ReactNode 
    }>) => {
    return (
        <>
            
                <Header/>
                    <div>
                        {children}
                    </div>
            
        </>
    );
}

export default MainLayout;