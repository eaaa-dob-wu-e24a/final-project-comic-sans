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

  const url = process.env.NEXT_PUBLIC_API_URL + "/api/user/signup";
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
  };

  // creates a user and redirects to login page
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const result = await response.json();
      console.log(result);

      if (result.status === "success") {
        router.push("/login");
      } else {
        setError(result.message);
      }
    } else {
      const errorText = await response.text();
      console.error("Error:", errorText);
      setError("An error occurred. Please try again.");
    }

    console.log("Form submitted:", formData);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-gradientstart to-gradientend pb-0">
        <section className="mx-auto flex flex-col justify-center items-center pt-32">
          <section className="relative z-10 w-full max-w-md p-8 space-y-4 text-white">
            <h2 className="text-2xl font-bold text-center text-white">
              SIGN UP
            </h2>
            <form onSubmit={handleSubmit} className="space-y-1">
              <div>
                <FormLabel htmlFor="username">Name:</FormLabel>
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
                <FormLabel htmlFor="email">Email:</FormLabel>
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
                <FormLabel htmlFor="password">Password:</FormLabel>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col items-center mt-4 space-y-2 pt-6">
                <Button
                  variant="secondary"
                  type="submit"
                >
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
    </>
  );
};

export default Register;
