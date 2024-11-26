import React from "react";

export default function ProfileAvatar({ name, imageUrl }) {
  // Extract the first letter from the user's name
  const initials = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="relative flex items-center">
      {/* Conditional rendering for profile image or initials */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center text-lg font-bold">
          {initials}
        </div>
      )}
      <svg
        className="w-4 h-4 ml-2 text-white"
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
  );
}
