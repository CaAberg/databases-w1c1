import AccountLinks from "../AccountLinks";
import Logo from "../logo";
import SearchBar from "../searchBar";

const Header = () => {
  return (
    <header className="w-full bg-gray-800 text-white px-4 py-8 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4">
      
      <div className="flex items-center space-x-4 flex-shrink-0">
        <Logo />
        <h1 className="text-2xl font-bold">Reddit clone</h1>
      </div>

      <div className="py-8 md:mt-0 md:flex-1">
        <SearchBar />
      </div>

      <div className="mt-4 md:mt-0 flex-shrink-0 ">
        <AccountLinks />
      </div>

    </header>
  );
};

export default Header;
