"use client";
import React from "react";
import { useState, useEffect } from "react";
import GradientCurve from "@/components/gradientcurve";
import VotedEventList from "@/components/event-participation";

const EventPage = () => {
  return (
    <main>
      <section className="max-w-6xl mx-auto">
        <VotedEventList></VotedEventList>
      </section>
    </main>
  );
};

export default EventPage;
