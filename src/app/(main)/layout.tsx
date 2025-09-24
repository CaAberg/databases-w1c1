import Header from "../components/header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
           < Header/>
            <div>{children}</div>
        </div>
    );
}

export default MainLayout;