"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Report {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const router = useRouter();

  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reports");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <div className="space-x-2">
          <button
            onClick={() => router.push("/employee")}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            ← Back
          </button>

          {/* ✅ Add Report Button */}
          <button
            onClick={() => router.push("/employee/reports/new")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Report
          </button>
        </div>
      </div>

      {/* Reports List */}
      <ul className="space-y-2">
        {reports.length > 0 ? (
          reports.map((report) => (
            <li key={report._id} className="p-4 bg-white rounded shadow">
              <h2 className="font-semibold text-gray-800">{report.title}</h2>
              <p className="text-gray-600">{report.description}</p>
              <p className="text-xs text-gray-400">
                Created: {new Date(report.createdAt).toLocaleString()}
              </p>
            </li>
          ))
        ) : (
          <p className="text-gray-600">No reports found.</p>
        )}
      </ul>
    </div>
  );
}
