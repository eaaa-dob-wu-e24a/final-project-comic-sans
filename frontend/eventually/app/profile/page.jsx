"use client";

import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/authcontext";
import GradientCurve from "../../components/gradientcurve";
import Button from "../../components/ui/button";
import Image from "next/image";
import ProfileAvatar from "../../components/profile-avatar";
import Input from "../../components/ui/input";
import FormLabel from "../../components/ui/formlabel";
import { useNotif } from "@/components/notif-context";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, setUser, loading } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [timeZone, setTimeZone] = useState("Central European Standard Time");

  const notif = useNotif();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  // Upload profile photo
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file); // Debug statement

      uploadProfilePhoto(file);
    }
  };

  // Send the profile photo file to the backend
  const uploadProfilePhoto = async (file) => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/upload-photo/";
    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include", // Include cookies for session handling
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        notif?.send("Profile photo updated successfully!");
        // Update the user context with the new imagePath
        if (setUser) {
          setUser({ ...user, imagePath: data.imagePath });
        }
      } else {
        notif?.send(
          `Error: ${data.Error || "Failed to upload profile photo."}`
        );
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      notif?.send("An error occurred while uploading the profile photo.");
    }
  };

  // Change user name and/or email
  const handleSaveDetails = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/update-details/";
    try {
      const response = await fetch(url, {
        method: "PATCH",
        credentials: "include", // Include cookies for session handling
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: name,
          Email: email,
          // Include ImagePath if it's being updated
        }),
      });

      const data = await response.json();

      if (response.ok) {
        notif?.send("Details saved successfully!");
        setIsEditing(false);

        // Update the user context
        if (setUser) {
          setUser({ ...user, name: name, email: email });
        }
      } else {
        // Handle errors returned from the server
        notif?.send(`Error: ${data.Error || "Failed to update details."}`);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      notif?.send("An error occurred while updating details.");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Change password
  const handleSavePassword = async () => {
    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      notif?.send("Please fill in all the fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      notif?.send("New passwords do not match.");
      return;
    }

    // Send data to the backend
    const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/update-details/";

    try {
      const response = await fetch(url, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        notif?.send("Password changed successfully!");
        setIsEditingPassword(false);
        // Clear the input fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // Handle errors returned from the server
        notif?.send(`Error: ${data.Error || "Failed to change password."}`);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      notif?.send("An error occurred while changing password.");
    }
  };

  // Cancel password change
  const handleCancelPasswordChange = () => {
    setIsEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Toggle dark theme
  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle("dark");
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/delete/";
      try {
        const response = await fetch(url, {
          method: "DELETE",
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          notif?.send("Account deleted successfully.");
          // Clear user context and redirect to home or login
          if (setUser) {
            setUser(null);
          }
          window.location.href = "/"; // or router.push("/login") if using Next.js router
        } else {
          notif?.send(`Error: ${data.error || "Failed to delete account."}`);
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        notif?.send("An error occurred while deleting account.");
      }
    }
  };

  // Logout
  const handleLogout = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/logout/";
    await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    setUser(null); // Clear user state
    notif?.send("Successfully logged out");
    router.push("/"); // Redirect to login page
  };

  return (
    <main className="pt-30 min-h-screen">
      <section className="bg-gradient-to-r from-gradientstart to-gradientend" />
      <GradientCurve className={"max-h-24"}>
        <div className="max-w-6xl mx-auto flex">
          <h1 className="font-bold text-2xl mx-auto max-w-6xl pb-12 text-white">
            Profile
          </h1>
        </div>
      </GradientCurve>
      <section className="mx-auto flex flex-grow flex-col gap-4 p-4 w-full md:w-4/5 lg:w-4/5">
        {isEditing ? (
          // Edit Profile
          <div className="bg-background shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Edit details</h2>
            <div className="flex flex-col md:flex-row lg:flex-row items-left mb-4 gap-4">
              <div className="relative">
                <ProfileAvatar variant="large" />
                <label
                  htmlFor="profilePhotoInput"
                  className="absolute bottom-4 left-24 md:bottom-2 md:right-2 bg-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                  title="Change Profile Photo"
                >
                  <input
                    type="file"
                    id="profilePhotoInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Image
                    src="/camera.svg"
                    alt="Camera"
                    width={20}
                    height={20}
                  />
                </label>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/2">
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  placeholder={user.name}
                  onChange={(e) => setName(e.target.value)}
                />
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder={user.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="secondaryoutline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={handleSaveDetails}>
                Save
              </Button>
            </div>
          </div>
        ) : isEditingPassword ? (
          // Change Password Section
          <div className="bg-background shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Change password</h2>
            <div className="mb-6 md:pr-2 lg:pr-2 w-1/2 ">
              <FormLabel>Current password</FormLabel>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-2 md:gap-4 lg:gap-4 mb-6">
              <div className="w-1/2">
                <FormLabel>New password</FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="w-1/2 md:pl-2 lg:pl-2">
                <FormLabel>Confirm password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                variant="secondaryoutline"
                onClick={handleCancelPasswordChange}
              >
                Cancel
              </Button>
              <Button variant="secondary" onClick={handleSavePassword}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          // Profile Details
          <div className="bg-background shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Profile details</h2>
            <div className="flex flex-col md:flex-row lg:flex-row items-center mb-4 gap-4">
              <div className="relative">
                <ProfileAvatar variant="large" />
              </div>
              <div className="md:ml-6 lg:ml-6">
                <p className="text-xl text-center md:text-left lg:text-left font-medium">
                  {user.name}
                </p>
                <p className="text-sm text-center md:text-left lg:text-left text-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex justify-end flex-col w-full gap-4 md:flex-row lg:flex-row md:space-x-4">
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Edit Details
              </Button>
              <Button
                variant="primaryoutline"
                onClick={() => setIsEditingPassword(true)}
              >
                Change Password
              </Button>
            </div>
          </div>
        )}

        {/* App Settings */}
        <div className="bg-background shadow-md rounded-lg p-6 mb-6 w-full">
          <h2 className="text-xl font-bold mb-4">App settings</h2>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium">Notifications</span>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="form-checkbox"
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
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium mb-2">Time Zone</label>
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="rounded-full shadow-cardshadow text-dark py-2 px-4 w-full focus:border-secondary focus:ring-1 focus:ring-secondary focus:bg-white/80 focus:outline-none"
            >
              <option>Central European Standard Time</option>
              <option>Eastern Time - US & Canada</option>
              <option>Pacific Time - US & Canada</option>
            </select>
            <p className="text-xs text-secondary mt-2">Current Time:</p>
          </div>
        </div>
      </section>

      {/* Log out and Delete Account */}
      <div className=" pb-6 mx-4 flex gap-4 justify-center flex-col md:flex-row lg:flex-row">
        <Button onClick={handleLogout} className="variant-primary">
          Log out
        </Button>
        <Button onClick={handleDeleteAccount} variant="secondaryoutline">
          Delete Account
        </Button>
      </div>
    </main>
  );
}
