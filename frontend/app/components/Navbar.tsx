"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";


const Navbar = () => {

  const Router=useRouter();

  const { user, logout, isLoggingOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const Logout=()=>{
    logout();
    Router.push("/");
  }

  return (
    <nav className="bg-white shadow px-4 py-3 fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-lg font-bold">MyApp</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <Link
              href="/auth"
              className="px-5 py-2 bg-[#7c73e6] text-white rounded-md"
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                href="/user-profile"
                className="px-4 py-2 border border-gray-500 rounded-full w-12 h-12 text-xl text-gray-700 font-extrabold flex flex-items-center justify-center shadow-xs"
              >
                {user.name[0]}
              </Link>

              <button
                onClick={Logout}
                disabled={isLoggingOut}
                className="px-4 py-2 border rounded-md"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-2 border-t pt-3">
          {!user ? (
            <Link
              href="/auth"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-[#7c73e6] text-white rounded-md text-center"
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                href="/user-profile"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-500 rounded-full w-12 h-12 text-xl text-gray-700 font-extrabold flex flex-items-center justify-center shadow-xs"
              >
                {user.name[0]}
              </Link>

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                disabled={isLoggingOut}
                className="px-4 py-2 border rounded-md"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;