"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import React, { useState } from "react";

const Header = () => {
  const { user, isLoading } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  function isString(value: string | null | undefined): value is string {
    return typeof value === "string";
  }
  return (
    <div>
      {" "}
      <header className="bg-blue-500 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <Link href={"/"} className="text-2xl font-bold" data-testid="code-figma-logo">
            RichTest
          </Link>
          <div className="flex items-center">
            {user && (
              <div className="relative">
                {user && (
                  <img
                    src={isString(user?.picture) ? user?.picture : ""}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full cursor-pointer"
                    onClick={toggleDropdown}
                    width={40}
                    height={40}
                  />
                )}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 py-2 bg-white border border-gray-300 rounded shadow-lg">
                    <div className="px-4 py-2">
                      <p className="font-bold text-black">{user.name}</p>
                    </div>
                    <Link
                      href="/api/auth/logout"
                      className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-blue-100"
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            )}
            {!isLoading && !user && (
              <Link
                href="/api/auth/login"
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
