"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LoginSite = () => {
  const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/logout";

  const handleLogout = async () => {
    try {
      // Call the logout endpoint
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Clear user data from localStorage
      localStorage.removeItem("user");

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect to login page if no user is found
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return null; // Render nothing if user is not logged in
  }

  return (
    <div className="flex justify-between items-center p-5 bg-gray-100 rounded-lg shadow-md">
      <h1 className="m-0 text-2xl text-gray-800">Hello, {user}</h1>
      <button
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default LoginSite;
