"use client";

import React from "react";
import Link from "next/link";
import { useContext } from "react"; 
import { AuthContext } from "../contexts/authcontext";

export default function MobileBottomNav() {
  const { usePathname } = require("next/navigation");
  const pathname = usePathname();
  const { user } = useContext(AuthContext); // Check if the user is logged in

  const loggedInNavItems = [
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

  const loggedOutNavItems = [
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
      href: "/signup",
      label: "SIGN UP",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="M725-410v-120H605v-60h120v-120h60v120h120v60H785v120h-60Zm-365-82.31q-57.75 0-98.87-41.12Q220-574.56 220-632.31q0-57.75 41.13-98.87 41.12-41.13 98.87-41.13 57.75 0 98.87 41.13Q500-690.06 500-632.31q0 57.75-41.13 98.88-41.12 41.12-98.87 41.12ZM60-187.69v-88.93q0-29.38 15.96-54.42 15.96-25.04 42.66-38.5 59.3-29.07 119.65-43.61 60.35-14.54 121.73-14.54t121.73 14.54q60.35 14.54 119.65 43.61 26.7 13.46 42.66 38.5Q660-306 660-276.62v88.93H60Zm60-60h480v-28.93q0-12.15-7.04-22.5-7.04-10.34-19.11-16.88-51.7-25.46-105.42-38.58Q414.7-367.69 360-367.69q-54.7 0-108.43 13.11-53.72 13.12-105.42 38.58-12.07 6.54-19.11 16.88-7.04 10.35-7.04 22.5v28.93Zm240-304.62q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0-80Zm0 384.62Z" />
        </svg>
      ),
      iconSelected: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="M725-410v-120H605v-60h120v-120h60v120h120v60H785v120h-60Zm-365-82.31q-57.75 0-98.87-41.12Q220-574.56 220-632.31q0-57.75 41.13-98.87 41.12-41.13 98.87-41.13 57.75 0 98.87 41.13Q500-690.06 500-632.31q0 57.75-41.13 98.88-41.12 41.12-98.87 41.12ZM60-187.69v-88.93q0-29.38 15.96-54.42 15.96-25.04 42.66-38.5 59.3-29.07 119.65-43.61 60.35-14.54 121.73-14.54t121.73 14.54q60.35 14.54 119.65 43.61 26.7 13.46 42.66 38.5Q660-306 660-276.62v88.93H60Z" />
        </svg>
      ),
    },
    {
      href: "/login",
      label: "LOGIN",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="M479.62-140v-60h268.07q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-535.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H479.62v-60h268.07Q778-820 799-799q21 21 21 51.31v535.38Q820-182 799-161q-21 21-51.31 21H479.62Zm-54.23-169.23-41.54-43.39L481.23-450H140v-60h341.23l-97.38-97.38 41.54-43.39L596.15-480 425.39-309.23Z" />
        </svg>
      ),
      iconSelected: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
        </svg>
      ),
    },
  ];

  const navItems = user ? loggedInNavItems : loggedOutNavItems;

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
