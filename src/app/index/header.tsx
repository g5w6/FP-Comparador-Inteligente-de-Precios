"use client";

import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className="container mx-auto p-2 md:p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        {/* Logo */}
        <div className="mb-3 sm:mb-0">
          <Image
            src="/oxc.svg"
            alt="Logo Precio Justo"
            width={24}
            height={24}
            className="w-5 h-5 sm:w-6 sm:h-6"
            priority
          />
        </div>

        {/* Eslogan */}
        <div className="mb-3 sm:mb-0 text-center sm:text-left">
          <h2 className="text-white text-sm sm:text-base font-medium">
            Encuentra los mejores precios en tu ciudad
          </h2>
        </div>

        {/* Redes sociales */}
        <div className="flex space-x-4">
          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200 transition-colors"
          >
            <Image
              src="/facebook.svg"
              alt="Facebook"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </Link>
          <Link
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200 transition-colors"
          >
            <Image
              src="/x_twitter.svg"
              alt="X"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200 transition-colors"
          >
            <Image
              src="/instagram.svg"
              alt="Instagram"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
