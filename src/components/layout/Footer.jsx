import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-5">Framy</h3>
            <p className="mb-6 leading-relaxed">
              Empowering learners with high-quality online education. Join us and grow your skills!
            </p>
            <div className="flex space-x-5 text-gray-400">
              <a href="#" aria-label="Facebook" className="hover:text-blue-600 transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-blue-400 transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-blue-700 transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="#" aria-label="GitHub" className="hover:text-gray-100 transition-colors">
                <FaGithub size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-2">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Courses</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-2">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-2">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm select-none">
          <p>© {new Date().getFullYear()} Framy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
