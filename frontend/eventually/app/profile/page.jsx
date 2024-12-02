"use client";

import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/authcontext";
import GradientCurve from "../../components/gradientcurve";
import Button from "../../components/ui/button";

export default function Profile() {
  const { user, loading } = useContext(AuthContext);
  console.log("User object:", user);

  const [email, setEmail] = useState("siiri@gmail.com");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [timeZone, setTimeZone] = useState("Central Time - US & Canada");

    if (loading) {
      return <div>Loading...</div>;
    }

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      alert("Account deleted successfully.");
    }
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <main className="pt-20 min-h-screen">
      <section className="bg-gradient-to-r from-gradientstart to-gradientend" />
      <GradientCurve className={"max-h-24"}>
        <div className="max-w-6xl mx-auto flex">
          <h1 className="font-bold text-2xl mx-auto max-w-6xl pb-12 text-white">
            Profile
          </h1>
        </div>
      </GradientCurve>
      <section className="mx-auto flex flex-grow flex-col gap-4 p-6 w-6xl">
        <div className="bg-background shadow-md rounded-lg p-6 mb-6 mx-auto w-4/5 ">
          <h2 className="text-xl font-bold mb-4">Profile details</h2>
          <div className="flex items-center mb-4">
            {/* Profile photo */}
            <div className="relative w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-white mr-4">
              S
              <label
                className="absolute bottom-0 right-0 bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                title="Change Profile Photo"
              >
                <input type="file" className="hidden" />
                <span className="text-sm">📷</span>
              </label>
            </div>
            <div>
              <p className="text-lg font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button variant="secondary">Edit Details</Button>
            <Button variant="secondaryoutline">Change Password</Button>
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-background shadow-md rounded-lg p-6 mb-6 mx-auto w-4/5 ">
          <h2 className="text-xl font-bold mb-4">App settings</h2>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium">Notifications</span>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="form-checkbox text-blue-500"
              />
            </label>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium">Dark theme</span>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isDarkTheme}
                onChange={handleThemeToggle}
                className="form-checkbox text-blue-500"
              />
            </label>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-2">Time Zone</label>
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-500"
            >
              <option>Central Time - US & Canada</option>
              <option>Eastern Time - US & Canada</option>
              <option>Pacific Time - US & Canada</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">Current Time: 10:02pm</p>
          </div>
        </div>

        {/* Delete Account */}
        <div className="text-center mt-6">
          <Button onClick={handleDeleteAccount} variant="secondaryoutline">
            Delete Account
          </Button>
        </div>
      </section>
    </main>
  );
}
