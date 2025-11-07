"use client";

import { useEffect, useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
}

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/team")
      .then((res) => res.json())
      .then((data: TeamMember[]) => setTeam(data))
      .catch((err) => console.error("Error fetching team:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Team Members</h1>
      <p className="text-gray-600 mb-6">View your colleagues and team info.</p>

      <ul className="space-y-2">
        {team.map((member) => (
          <li key={member.id} className="p-4 bg-white rounded shadow">
            {member.name} - {member.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
