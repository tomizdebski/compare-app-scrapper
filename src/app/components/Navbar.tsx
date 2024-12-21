"use client"; // this is a client component
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavItem {
  label: string;
  page: string;
}

const NAV_ITEMS: Array<NavItem> = [
  
  {
    label: "Moje Produkty",
    page: "myProducts",
  },
];

export default function Navbar() {
  const [navbar, setNavbar] = useState(false);
  return (
    <header className="container w-full mx-auto text-white sticky bg-[#0a0a0a] top-0 z-50 shadow-md">
      <div className="flex flex-wrap items-center justify-between py-3 md:py-5">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <Image
              src="/icons/logo.svg"
              alt="logo"
              width={200}
              height={200}
              className="cursor-pointer"
            />
          </div>
        </Link>

        <div className="md:hidden">
          <button
            className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
            onClick={() => setNavbar(!navbar)}
          >
            {navbar ? (
              // Ikona "zamknij"
              <svg
                className="w-6 h-6 text-black dark:text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Ikona "hamburger"
              <svg
                className="w-6 h-6 text-black dark:text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <div
          className={`w-full md:flex md:items-center md:w-auto mt-4 md:mt-0 transition-all duration-300 ease-in-out ${
            navbar ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 items-center md:justify-center">
            {NAV_ITEMS.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={`/${item.page}`}
                  className="block text-neutral-900 hover:text-neutral-500 dark:text-neutral-100"
                  onClick={() => setNavbar(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
