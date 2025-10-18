const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-gray-400 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm">
              © {new Date().getFullYear()} FISHERDB. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="/about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
