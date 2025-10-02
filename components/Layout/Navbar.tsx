import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [langOpen, setLangOpen] = useState(false);
  const [erselliOpen, setErselliOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-4 py-3">
        
        {/* Logo */}
        <div className="flex items-center">
          <a href="#">
            <img
              className="h-14 w-auto px-2"
              src="https://mobilis.dz/storage/1931/logo_blanc.png"
              alt="Mobilis.dz"
            />
          </a>
          {/* Mobile CIB */}
          <div className="ml-2 lg:hidden">
            <a href="#">
              <Image
                className="h-8"
                width={40}   // set a small width in pixels
                height={20}
                src="/assets/cib_dahabia_btn.png"
                alt="CIB Dahabia"
              />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex space-x-6">
            <li>
              <a
                href="#"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Personal
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-4 py-2 hover:text-green-600"
              >
                Business
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-4 py-2 text-black hover:text-green-600"
              >
                Become a Partner
              </a>
            </li>
          </ul>
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-6 mt-4 lg:mt-0">
          {/* E-rselli Dropdown */}
          <div className="relative">
            <button
              onClick={() => setErselliOpen(!erselliOpen)}
              className="flex items-center space-x-2 text-sm font-medium"
            >
              <Image
                className="h-8"
                width={40}   // set a small width in pixels
                height={20}
                src="/assets/cib_dahabia_btn.png"
                alt="CIB Dahabia"
              />
              <span>E-rselli</span>
            </button>
            {erselliOpen && (
              <ul className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border">
                <li>
                  <a
                    href="https://e-paiement.mobilis.dz/"
                    target="_blank"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Public
                  </a>
                </li>
                <li>
                  <a
                    href="https://corporate.mobilis.dz/epaiement/"
                    target="_blank"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Enterprise
                  </a>
                </li>
              </ul>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center space-x-1 text-sm font-medium"
            >
              <i className="fa-solid fa-globe"></i>
              <span>English</span>
              <i className="fa-solid fa-caret-down"></i>
            </button>
            {langOpen && (
              <ul className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border">
                <li>
                  <a
                    href="https://mobilis.dz/language/ar"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Arabic
                  </a>
                </li>
                <li>
                  <a
                    href="https://mobilis.dz/language/fr"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    French
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
