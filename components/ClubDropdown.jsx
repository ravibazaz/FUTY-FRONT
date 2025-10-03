"use client";

import { useState, useEffect } from "react";

export default function ClubDropdown() {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("/api/clubs");
        const data = await response.json();
        setClubs(data);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };
    fetchClubs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Select a Club</h2>
      <select
        className="border p-2 rounded"
        value={selectedClub}
        onChange={(e) => setSelectedClub(e.target.value)}
      >
        <option value="">Choose a club</option>
        {clubs.map((club) => (
          <option key={club._id} value={club.name}>
            {club.name}
          </option>
        ))}
      </select>
      {selectedClub && (
        <p className="mt-4">Selected Club: <strong>{selectedClub}</strong></p>
      )}
    </div>
  );
}
