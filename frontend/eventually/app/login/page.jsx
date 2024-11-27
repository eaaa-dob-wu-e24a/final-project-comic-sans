"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/login";

  //Login function
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(url, {
      method: "POST",
      credentials: "include", // Include cookies for session handling
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(data);

    if (data.status === "success") {
      console.log("Login successful");

      router.push("/dashboard");
    }
  };

  return (
    <main className="relative top-0 min-h-screen pt-36 bg-[url('/background.svg')] bg-top bg-no-repeat flex flex-col items-center justify-start text-white">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-gray-700"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
