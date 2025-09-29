import Header from "../components/header";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Header />
            <div>{children}</div>
        </div>
    );
}

export default AuthLayout;