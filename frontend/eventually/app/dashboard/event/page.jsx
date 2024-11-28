"use client";
import React from "react";
import UserEventList from "@/components/user-event-list";
import { useState, useEffect } from "react";

const EventPage = () => {
  return (
    <div>
      <UserEventList></UserEventList>
    </div>
  );
};

export default EventPage;
