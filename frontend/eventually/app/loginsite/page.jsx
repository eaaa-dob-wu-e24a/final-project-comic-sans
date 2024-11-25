"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EventUpdateForm from "@/components/event-update-form";

const LoginSite = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  //check if user is logged in
  const checkSession = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/check_session";
    const response = await fetch(url, {
      method: "GET",
      credentials: "include", // Include cookies for session handling
    });
    const data = await response.json();

    if (data.status === "success") {
      setUser(data.user);
    } else {
      // Redirect to login page if not logged in
      router.push("/login");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogout = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/logout";
    await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    setUser(null); // Clear user state
    router.push("/login"); // Redirect to login page
  };

  if (!user) {
    return null; // Render nothing if user is not logged in
  }

  return (
    <div className="flex justify-between items-center p-5 bg-gray-100 rounded-lg shadow-md">
      <h1 className="m-0 text-2xl text-gray-800">
        Hello, {user.name} your email is {user.email}
      </h1>
      <button
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        onClick={handleLogout}
      >
        Logout
      </button>
      <EventUpdateForm></EventUpdateForm>
    </div>
  );
};

export default LoginSite;
