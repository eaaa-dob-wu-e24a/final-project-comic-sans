import React, { useState, useEffect, useRef } from "react";

const ProfileAvatar = ({ name, imageUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleLogout = () => {
    console.log("Log out clicked");
    // Add your logout logic here
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar and Chevron */}
      <div
        className="flex items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-bold">
            {name ? name.charAt(0).toUpperCase() : "?"}
          </div>
        )}
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
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 bg-green-700 text-white rounded-t-lg">
            <p className="font-bold">{name}</p>
            <p className="text-sm">siiri.lietu@gmail.com</p>
          </div>
          <ul className="divide-y divide-gray-200">
            <li>
              <a
                href="/dashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/account-settings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Account Settings
              </a>
            </li>
            <li>
              <a
                href="/help-support"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Help and Support
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Log out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
