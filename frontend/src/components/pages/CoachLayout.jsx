// src/components/CoachLayout.jsx
import React from "react";

export default function CoachLayout({ coach, seats }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
      <h3 className="font-bold mb-2">Coach {coach}</h3>
      <p>Seats: {seats?.join(", ") || "No seats available"}</p>
    </div>
  );
}
