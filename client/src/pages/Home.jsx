import { Link } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sanitizeInput = (input) => {
    return input.replace(/['";\\*\-]/g, "");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanedInput = sanitizeInput(searchTerm.trim());

    if (!cleanedInput) {
      setErrorMessage("Please enter a valid search term");
      return;
    }

    setErrorMessage("");
    console.log(cleanedInput);

    // Can add API
  };
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* Main Section */}
      <div className="bg-[#1F2937] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Industrial Supplies & Engineering Tools
          </h1>
          <p className="text-lg mb-8">
            Your trusted partner in industrial equipment and MRO supplies
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search 500,000+ products..."
                className="flex-1 bg-white px-4 py-3 text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#F59E0B] px-6 py-3 hover:bg-[#D97706] transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
            {errorMessage && (
              <p className="text-red-300 mt-2 text-sm">{errorMessage}</p>
            )}
          </form>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-[#1F2937] mb-8">
          Popular Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "Power Tools",
            "Safety Equipment",
            "Hydraulics",
            "Fasteners",
            "Electrical",
            "Plumbing",
          ].map((category) => (
            <div
              key={category}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-12 w-12 bg-[#F59E0B] rounded-full mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                {category}
              </h3>
              <p className="text-gray-600">
                Explore our wide range of {category.toLowerCase()} products
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="h-12 w-12 bg-[#1F2937] rounded-full mb-4 mx-auto flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Next Day Delivery</h3>
              <p className="text-gray-600">
                Order by 8pm for next day delivery
              </p>
            </div>

            <div className="text-center">
              <div className="h-12 w-12 bg-[#1F2937] rounded-full mb-4 mx-auto flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                Premium products from trusted brands
              </p>
            </div>

            <div className="text-center">
              <div className="h-12 w-12 bg-[#1F2937] rounded-full mb-4 mx-auto flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">Technical assistance 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1F2937] text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              {["About Us", "Careers", "Contact", "Locations"].map((item) => (
                <li key={item}>
                  <Link
                    to="/home"
                    className="hover:text-[#F59E0B] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; 2024 Industrial Supplies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
