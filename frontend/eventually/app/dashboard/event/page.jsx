"use client";
import React from "react";
import UserEventList from "@/components/user-event-list";
import { useState, useEffect } from "react";
import GradientCurve from "@/components/gradientcurve";

const EventPage = () => {
  return (
    <main>
      <section className="max-w-6xl mx-auto">
        <UserEventList></UserEventList>
      </section>
    </main>
  );
};

export default EventPage;
