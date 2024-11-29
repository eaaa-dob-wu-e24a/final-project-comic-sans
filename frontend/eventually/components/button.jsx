"use client"
import React from "react";

export default function Button({label}) {
    return (
      <button className="w-full rounded-full px-3 text-sm py-3 font-bold text-white bg-secondary hover:bg-secondary-hover transition-all duration-200">
        {label}
      </button>
    );
}