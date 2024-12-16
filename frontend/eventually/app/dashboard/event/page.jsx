"use client";
import React from "react";
import UserEventList from "@/components/user-event-list";
import { useState, useEffect } from "react";
import GradientCurve from "@/components/gradientcurve";

const EventPage = () => {
  return (
    <main className="min-h-screen">
      <section className="max-w-6xl mx-auto">
        <UserEventList></UserEventList>
      </section>
      {/* Dynamic Section to push footer to bottom */}
      <section className="flex-grow bg-page-background" />
    </main>
  );
};

export default EventPage;
