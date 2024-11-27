"use client"
import React from "react";

export default function Button({label}) {
    return (
        <button
            type="submit"
            className="w-full rounded-full px-4 py-2 font-bold text-white bg-secondary focus:outline-none focus:ring focus:ring-indigo-200"
        >
            {label}
        </button>
    )
}