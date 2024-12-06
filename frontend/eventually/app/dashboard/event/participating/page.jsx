"use client";
import React from "react";
import { useState, useEffect } from "react";
import GradientCurve from "@/components/gradientcurve";
import AllEventList from "@/components/all-events-list";

const EventPage = () => {
  return (
    <main>
      <section className="max-w-6xl mx-auto">
        <AllEventList></AllEventList>
      </section>
    </main>
  );
};

export default EventPage;
