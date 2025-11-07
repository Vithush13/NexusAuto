"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UsedInventory {
  inventoryId: {
    _id: string;
    item: string;
    quantity: string;
  };
  quantityUsed: number;
}

interface TaskSubmission {
  _id: string;
  employeeName: string;
  taskName: string;
  usedInventory: UsedInventory[];
  createdAt: string;
}

export default function InventoryUsedPage() {
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/api/inventoryUsage")
      .then((res) => res.json())
      .then((data: TaskSubmission[]) => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching submissions:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading submissions...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header + Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Inventory Used by Employees
        </h1>
        <div className="flex space-x-3">
          {/* Back Button */}
          <button
            onClick={() => router.push("/employee")}
            className="bg-gray-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all shadow-md"
          >
            ← Back
          </button>

          {/* Add Inventory Usage Button */}
          <button
            onClick={() => router.push("/employee/inventory/form")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
          >
            + Add Inventory Usage
          </button>
        </div>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <p className="text-gray-600">No task submissions found.</p>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission) => (
            <div
              key={submission._id}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  {submission.taskName} 
                </h2>
                <span className="text-sm text-gray-500">
                  {new Date(submission.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Used Inventory:
                </h3>
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left">
                        Item
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left">
                        Quantity Used
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {submission.usedInventory.map((inv) => (
                      <tr key={inv.inventoryId._id}>
                        <td className="border border-gray-300 px-3 py-2">
                          {inv.inventoryId.item}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {inv.quantityUsed}
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
