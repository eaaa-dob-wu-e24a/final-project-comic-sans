"use client";
import React from "react";
import { useState, useEffect } from "react";
import GradientCurve from "@/components/gradientcurve";
import VotedEventList from "@/components/event-participation";

const EventPage = () => {
  return (
    <main className="min-h-screen">
      <section className="max-w-6xl mx-auto">
        <VotedEventList></VotedEventList>
      </section>
      {/* Dynamic Section to push footer to bottom */}
      <section className="flex-grow bg-page-background" />
    </main>
  );
};

export default EventPage;
