"use client";
import Link from "next/link";
import Button from "../components/button";
import ProfileAvatar from "../components/profile-avatar";
import { AuthContext } from "../app/authcontext";
import { useContext } from "react";
import Image from "next/image";

export default function Navbar() {
  const { user, loading } = useContext(AuthContext);

  return (
    <nav className="flex justify-between items-center px-20 py-5 text-white bg-gradient-to-r from-gradientstart to-gradientend fixed top-0 left-0 w-full z-50">
      <div className="flex items-center gap-6">
        {/* Conditionally render the "Eventually" text when user is logged in */}
        {user && (
          <div className="flex flex-row gap-4">
            <Image
              src="/logo.svg"
              alt="Eventually"
              width={40} 
              height={40}
            />
            <h1 className="font-[family-name:var(--font-dancing-script)] text-3xl">
              Eventually
            </h1>
          </div>
        )}
      </div>
      <div className="flex gap-10 items-center">
        {loading ? (
          <div>Loading...</div>
        ) : user ? (
          // Render this if the user is logged in

          <>
            <ProfileAvatar user={user} />
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
