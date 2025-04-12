import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <p className="text-sm text-gray-300">
              We are a leading eCommerce store offering the best in fashion and
              accessories. Our mission is to provide high-quality products with
              exceptional customer service.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/clothing"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  href="/accessories"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <FaFacebook className="h-6 w-6" />
              </Link>
            
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <FaInstagram className="h-6 w-6" />
              </Link>
           
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} The Melting Pot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}