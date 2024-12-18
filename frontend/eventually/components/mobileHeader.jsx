"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function MobileHeader() {
  const pathname = usePathname(); // Get the current route

  return (
    <header
      className="
        fixed top-0 inset-x-0
        h-16
        flex items-center justify-between
        bg-background
        border-none
        z-50
        px-7
        bg-gradient-to-r from-gradientstart to-gradientend
      "
    >
      <Link href={"/"} className="flex items-center gap-4">
        <Image src="/logo.svg" alt="Eventually" width={20} height={20} />
        {pathname !== "/" && (
          <h1 className="font-dancing-script text-white text-xl">Eventually</h1>
        )}
      </Link>
      <Link href="/create">
        <Button variant="secondary">Create event</Button>
      </Link>
    </header>
  );
}
