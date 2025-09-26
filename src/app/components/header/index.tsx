import AccountLinks from "../AccountLinks";
import SearchBar from "../searchBar";
import Link from 'next/link';

const Header = () => {
  return (
  <header className="w-full bg-gray-800 text-white px-8 py-4">
      <div className="flex flex-col md:flex-row items-center gap-4 md:grid md:grid-cols-3 max-w-7xl mx-auto">
        <div className="flex items-center hover:bg-gray-700 p-4 rounded-2xl justify-self-start">
          <h1 className="text-2xl font-bold">
            <Link href="/" className="hover:text-gray-200">Reddit Clone</Link>
          </h1>
        </div>
        
        <div className="w-full max-w-md justify-self-center">
          <SearchBar />
        </div>
        
        <div className="flex items-center justify-self-end">
          <AccountLinks />
        </div>
      </div>
    </header>
  );
};

export default Header;
