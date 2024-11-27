"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "../components/button";
import ProfileAvatar from "../components/profile-avatar";


export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch authentication status
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/user/check_session",
          {
            method: "GET",
            credentials: "include", // Include cookies in the request
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (data.status === "success") {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching auth status:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthStatus();
  }, []);

  return (
    <nav className="flex justify-between items-center px-20 py-5 text-white bg-transparent fixed top-0 left-0 w-full z-50">
      <div className="flex items-center gap-6">
        {/* Conditionally render the "Eventually" text when user is logged in */}
        {user && (
          <h1 className="font-[family-name:var(--font-dancing-script)] text-3xl">
            Eventually
          </h1>
        )}
      </div>
      <div className="flex gap-10 items-center">
        {loading ? (
          <div>Loading...</div>
        ) : user ? (
          // Render this if the user is logged in

          <>
            <ProfileAvatar user={user} setUser={setUser} />
            <Button label="CREATE EVENT" className="m-10" />
          </>
        ) : (
          // Render this if the user is not logged in
          <>
            <Link
              href="/login"
              className="flex items-center w-20 whitespace-nowrap"
            >
              LOGIN
            </Link>
            <Link
              href="/signup"
              className="flex items-center w-20 whitespace-nowrap"
            >
              SIGN UP
            </Link>
            <Button label="CREATE EVENT" className="m-10" />
          </>
        )}
      </div>
    </nav>
  );
}
