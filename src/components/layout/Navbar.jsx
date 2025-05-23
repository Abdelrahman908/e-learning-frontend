import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import logo from "../../assets/images/Framy.jpg";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="w-full py-4 px-10 shadow-md flex justify-around items-center bg-white sticky top-0 z-50 border-b border-gray-200">
      {/* جهة اليسار: اسم المستخدم أو أزرار تسجيل الدخول والتسجيل */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {token ? (
          <Menu as="div" className="relative">
            <Menu.Button
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition shadow-sm"
              aria-label="User menu"
            >
              <span className="text-gray-800 font-semibold">{user?.FullName || user?.Email || "User"}</span>
              <ChevronDownIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
            </Menu.Button>

            <Transition
              enter="transition ease-out duration-150"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-100"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 mt-2 w-48 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/dashboard")}
                      className={`w-full text-left px-4 py-2 text-sm font-medium rounded-t-md ${
                        active ? "bg-blue-50 text-blue-700" : "text-gray-700"
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
                        navigate("/login"); // تحويل لصفحة تسجيل الدخول بعد الخروج
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-medium rounded-b-md ${
                        active ? "bg-red-50 text-red-600" : "text-gray-700"
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition font-semibold shadow-sm"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition font-semibold shadow-md"
            >
              Register
            </button>
          </>
        )}
      </div>

      {/* جهة اليمين: الشعار وروابط التنقل */}
      <div className="flex items-center space-x-6 rtl:space-x-reverse">
        {/* روابط التنقل */}
        <nav className="hidden md:flex space-x-6 font-semibold text-gray-700 rtl:space-x-reverse">
          {["home", "courses", "about", "contact"].map((item) => (
            <Link
              key={item}
              to={item === "home" ? "/" : `/${item}`}
              className="relative group px-2 py-1 hover:text-blue-600 transition"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
              <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-[2px] bg-blue-600 transition-all"></span>
            </Link>
          ))}
        </nav>

        {/* الشعار */}
        <Link to="/" aria-label="Go to homepage">
          <img src={logo} alt="Framy Logo" className="h-14 w-auto object-contain" />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
