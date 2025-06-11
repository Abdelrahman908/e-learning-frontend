import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <motion.h3
              className="text-3xl font-extrabold text-white mb-6 tracking-wide cursor-pointer select-none"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Framy
            </motion.h3>
            <p className="mb-8 leading-relaxed text-gray-400 max-w-xs">
              Empowering learners with high-quality online education. Join us and grow your skills!
            </p>
            <div className="flex space-x-6 text-gray-400">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-blue-600 transition-colors duration-300"
              >
                <FaFacebook size={26} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                <FaTwitter size={26} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-blue-700 transition-colors duration-300"
              >
                <FaLinkedin size={26} />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="hover:text-gray-100 transition-colors duration-300"
              >
                <FaGithub size={26} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-3 tracking-wide uppercase">
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition-colors duration-300 text-lg"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="hover:text-white transition-colors duration-300 text-lg"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors duration-300 text-lg"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors duration-300 text-lg"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-3 tracking-wide uppercase">
              Resources
            </h4>
            <ul className="space-y-4">
              {["Blog", "FAQ", "Help Center", "Feedback"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300 text-lg"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-3 tracking-wide uppercase">
              Legal
            </h4>
            <ul className="space-y-4">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300 text-lg"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-14 pt-8 text-center text-gray-500 text-sm select-none tracking-wide">
          <p>© {new Date().getFullYear()} Framy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
