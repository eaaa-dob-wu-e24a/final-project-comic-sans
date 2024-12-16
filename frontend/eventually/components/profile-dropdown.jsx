"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../contexts/authcontext";
import ProfileAvatar from "./profile-avatar";
import { useNotif } from "./notif-context";

export default function ProfileDropdown() {
  const notif = useNotif();
  const { user, setUser } = useContext(AuthContext);
  console.log("User object:", user);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Toggle the dropdown state
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/logout/";
    await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    setUser(null); // Clear user state
    notif?.send("Successfully logged out");
    router.push("/"); // Redirect to login page
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar and Chevron */}
      <div
        className="flex items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <ProfileAvatar />
        <svg
          className={`w-4 h-4 ml-2 text-white transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-background rounded-lg overflow-hidden shadow-lg z-50">
          <div className="p-4 bg-primaryred text-foreground bg-secondary rounded-t-lg">
            <p className="font-bold">{user.name}</p>
          </div>
          <ul className="divide-y divide-secondary">
            <li>
              <a
                href="/dashboard"
                className="block px-4 py-2 text-foreground hover:bg-secondary-10"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/profile"
                className="block px-4 py-2 text-foreground hover:bg-secondary-10"
              >
                Account Settings
              </a>
            </li>
            <li>
              <a
                href="/help-support"
                className="block px-4 py-2 text-foreground hover:bg-secondary-10"
              >
                Help and Support
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 bg- text-primary font-bold hover:bg-secondary-10"
              >
                Log out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
