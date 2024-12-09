"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import GradientCurve from "@/components/gradientcurve";
import Input from "@/components/ui/input";
import FormLabel from "@/components/ui/formlabel";
import Button from "@/components/ui/button";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // State variable for error message

  const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/signup/";
  const router = useRouter();

  console.log(url);
  /**
   * Updates the form data when the user types in the input fields
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrorMessage(""); // Clear error message on input change
  };

  // creates a user and redirects to login page
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.username || !formData.email || !formData.password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "success") {
        console.log("Registration successful:", result);
        router.push("/login");
      } else {
        console.log("Registration failed:", result.message);
        setErrorMessage(result.message); // Display the error message from backend
      }
    } catch (error) {
      console.log("Error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-gradient-to-r from-gradientstart to-gradientend pb-0">
        <section className="mx-auto flex flex-col justify-center items-center pt-32">
          <section className="relative z-10 w-full max-w-md p-8 space-y-4 text-white">
            <h2 className="text-2xl font-bold text-center text-white">
              SIGN UP
            </h2>
            <form onSubmit={handleSubmit} className="space-y-1">
              <div>
                <FormLabel className="text-white" htmlFor="username">
                  Name:
                </FormLabel>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <FormLabel className="text-white" htmlFor="email">
                  Email:
                </FormLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <FormLabel className="text-white" htmlFor="password">
                  Password:
                </FormLabel>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Display error message here */}
              {errorMessage && (
                <div
                  className="text-white text-sm mt-2"
                  role="alert"
                  aria-live="assertive"
                >
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-col items-center mt-4 space-y-2 pt-6">
                <Button variant="secondary" type="submit">
                  Sign up
                </Button>
                <p className="text-center">
                  Already have an account?{" "}
                  <a href="/login" className="font-bold hover:underline">
                    Log in
                  </a>
                </p>
              </div>
            </form>
          </section>
        </section>
      </div>
      <GradientCurve />
      {/* Dynamic Section Below the Gradient Curve */}
      <section className="flex-grow bg-page-background" />
    </div>
  );
};

export default Register;
