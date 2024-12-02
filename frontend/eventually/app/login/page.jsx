"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../authcontext";
import GradientCurve from "../../components/gradientcurve";
import FormLabel from "../../components/ui/formlabel";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";

const LoginPage = () => {
  const { setUser } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/login";

  // Login function
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include", // Include cookies for session handling
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        console.log("Login successful");
        setUser(data.user); // Update the global user state
        router.push("/dashboard"); // Redirect to dashboard or desired page
      } else {
        console.error("Login failed:", data.message);
        // Handle login failure (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-gradientstart to-gradientend pb-0">
        <section className="mx-auto flex flex-col justify-center items-center pt-32">
          <section className="relative z-10 w-full max-w-md p-8 space-y-4">
            <h1 className="text-2xl font-bold text-center mb-6 text-white">
              LOGIN
            </h1>
            <form onSubmit={handleSubmit} className="space-y-1">
              <div>
                <FormLabel htmlFor="email">Email:</FormLabel>
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <FormLabel htmlFor="password">Password:</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className=" py-1 text-xs text-right underline">Forgot password?</p>
              </div>
              <div className="flex flex-col items-center mt-4 space-y-2 pt-6">
                <Button
                  className="bg-secondary hover:bg-secondary-hover transition-all duration-200"
                  type="submit"
                >
                  Log in
                </Button>
                <p className="text-center">
                  Don't have an account?{" "}
                  <a href="/signup" className="font-bold hover:underline">
                    Sign up
                  </a>
                </p>
              </div>
            </form>
          </section>
        </section>
      </div>
      <GradientCurve />
    </>
  );
};

export default LoginPage;
