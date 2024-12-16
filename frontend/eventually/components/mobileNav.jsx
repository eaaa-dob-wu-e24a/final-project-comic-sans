"use client";

import React from "react";
import Link from "next/link";

export default function MobileBottomNav() {
  const { usePathname } = require("next/navigation");
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "HOME",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          width="24px"
          fill="currentColor"
          viewBox="0 -960 960 960"
          className="h-5 w-5 mb-1"
        >
          <path d="M240-200h133.85v-237.69h212.3V-200H720v-360L480-740.77 240-560v360Zm-60 60v-450l300-225.77L780-590v450H526.15v-237.69h-92.3V-140H180Zm300-330.38Z" />
        </svg>
      ),
      iconSelected: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
          className="h-5 w-5 mb-1"
        >
          <path d="M180-140v-450l300-225.77L780-590v450H556.15v-267.69h-152.3V-140H180Z" />
        </svg>
      ),
    },
    {
      href: "/dashboard",
      label: "DASHBOARD",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          width="24px"
          fill="currentColor"
          viewBox="0 -960 960 960"
          className="h-5 w-5 mb-1"
        >
          <path d="M140-520v-300h300v300H140Zm0 380v-300h300v300H140Zm380-380v-300h300v300H520Zm0 380v-300h300v300H520ZM200-580h180v-180H200v180Zm380 0h180v-180H580v180Zm0 380h180v-180H580v180Zm-380 0h180v-180H200v180Zm380-380Zm0 200Zm-200 0Zm0-200Z" />
        </svg>
      ),
      iconSelected: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
          className="h-5 w-5 mb-1"
        >
          <path d="M140-520v-300h300v300H140Zm0 380v-300h300v300H140Zm380-380v-300h300v300H520Zm0 380v-300h300v300H520Z" />
        </svg>
      ),
    },
    {
      href: "/profile",
      label: "PROFILE",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          width="24px"
          fill="currentColor"
          viewBox="0 -960 960 960"
          className="h-5 w-5 mb-1"
        >
          <path d="M480-492.31q-57.75 0-98.87-41.12Q340-574.56 340-632.31q0-57.75 41.13-98.87 41.12-41.13 98.87-41.13 57.75 0 98.87 41.13Q620-690.06 620-632.31q0 57.75-41.13 98.88-41.12 41.12-98.87 41.12ZM180-187.69v-88.93q0-29.38 15.96-54.42 15.96-25.04 42.66-38.5 59.3-29.07 119.65-43.61 60.35-14.54 121.73-14.54t121.73 14.54q60.35 14.54 119.65 43.61 26.7 13.46 42.66 38.5Q780-306 780-276.62v88.93H180Zm60-60h480v-28.93q0-12.15-7.04-22.5-7.04-10.34-19.11-16.88-51.7-25.46-105.42-38.58Q534.7-367.69 480-367.69q-54.7 0-108.43 13.11-53.72 13.12-105.42 38.58-12.07 6.54-19.11 16.88-7.04 10.35-7.04 22.5v28.93Zm240-304.62q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0-80Zm0 384.62Z" />
        </svg>
      ),
      iconSelected: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          width="24px"
          fill="currentColor"
          viewBox="0 -960 960 960"
          className="h-5 w-5 mb-1"
        >
          <path d="M480-492.31q-57.75 0-98.87-41.12Q340-574.56 340-632.31q0-57.75 41.13-98.87 41.12-41.13 98.87-41.13 57.75 0 98.87 41.13Q620-690.06 620-632.31q0 57.75-41.13 98.88-41.12 41.12-98.87 41.12ZM180-187.69v-88.93q0-29.38 15.96-54.42 15.96-25.04 42.66-38.5 59.3-29.07 119.65-43.61 60.35-14.54 121.73-14.54t121.73 14.54q60.35 14.54 119.65 43.61 26.7 13.46 42.66 38.5Q780-306 780-276.62v88.93H180Z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 bg-background flex items-center justify-around z-50">
      {navItems.map(({ href, label, icon, iconSelected }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`text-xs flex flex-col items-center ${
              isActive ? "text-foreground font-bold" : "text-foreground"
            }`}
          >
            {isActive && iconSelected ? iconSelected : icon}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
