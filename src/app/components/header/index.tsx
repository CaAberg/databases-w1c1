import AccountLinks from "../AccountLinks";
import Logo from "../logo";

const Header = ( ) => {
    return (

        <header className="w-full flex justify-center items-center bg-gray-800 text-white p-4">
            <Logo />
            <h1 className="text-2xl p-4 font-bold">Reddit clone</h1>
            <div className="ml-auto">
                
                <AccountLinks />
            </div>            
        </header>
    );
}

export default Header;