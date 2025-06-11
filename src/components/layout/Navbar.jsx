import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import logo from "../../assets/images/Framy.jpg";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userInitial = user?.FullName?.charAt(0)?.toUpperCase() || user?.Email?.charAt(0)?.toUpperCase() || "U";
  const userImage = user?.profileImage;

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header className="w-full bg-white/80 border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="Framy"
              className="h-12 w-auto object-contain rounded-md transition-transform duration-300 group-hover:scale-110 shadow-sm"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="relative px-2 py-1 hover:text-blue-600 group transition"
              >
                {item.name}
                <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-blue-600 group-hover:w-full transition-all duration-300 rounded"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <Menu as="div" className="relative z-40">
                <Menu.Button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full shadow-sm transition text-gray-800 font-medium">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-sm">
                      {userInitial}
                    </span>
                  )}
                  <span className="hidden sm:block max-w-[120px] truncate">
                    {user?.FullName || user?.Email}
                  </span>
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                </Menu.Button>

                <Transition
                  enter="transition duration-200 ease-out"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition duration-150 ease-in"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-gray-200 overflow-hidden">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => navigate("/dashboard")}
                          className={`w-full px-4 py-2 text-sm text-left ${
                            active
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          Dashboard
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            logout();
                            navigate("/login");
                          }}
                          className={`w-full px-4 py-2 text-sm text-left ${
                            active
                              ? "bg-red-50 text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-sm text-sm font-semibold"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition shadow-sm text-sm font-semibold"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-2 bg-white text-sm font-medium text-gray-700">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {token ? (
              <>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2 border-b border-gray-100 text-left"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2 text-left text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2 text-left"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2 text-left"
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* 💬 Chatbot Floating Button */}
      <Link
        to="/chatbot"
        className="fixed bottom-6 left-6 md:left-8 z-50 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-3 rounded-full shadow-xl hover:scale-110 transition-all duration-300 text-sm font-semibold animate-bounce-slow"
        aria-label="Open Chatbot"
      >
        💬 FRAMY BOT
      </Link>

      {/* Bounce animation */}
      <style>
        {`
          @keyframes bounceSlow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }

          .animate-bounce-slow {
            animation: bounceSlow 3s infinite;
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
