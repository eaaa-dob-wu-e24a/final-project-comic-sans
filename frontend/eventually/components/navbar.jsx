"use client";
import React from "react";
import Link from "next/link"; // Corrected import
import Button from "../components/button"; // Ensure correct casing and path

export default function Navbar() {
    return (
      <nav className="flex justify-between items-center px-20 py-5 text-white bg-[url('/background.svg')] bg-cover bg-no-repeat">
        <div className="flex items-center gap-6">
          <h1 className="font-[family-name:var(--font-dancing-script)] text-3xl">
            Eventually
          </h1>
        </div>
        <div className="flex gap-10">
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
        </div>
      </nav>
    );
}
