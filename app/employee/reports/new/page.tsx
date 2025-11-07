"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal/modal";

export default function NewReportModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setIsOpen(false);
    router.push("/employee/reports"); // navigate back to main reports page
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setMessage("✅ Report submitted successfully!");
        setTitle("");
        setDescription("");
        setTimeout(() => handleClose(), 1000); // close modal after 1s
      } else {
        setMessage("❌ Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      setMessage("⚠️ Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Report">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Report Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded shadow-sm focus:ring focus:ring-blue-300"
          required
        />

        <textarea
          placeholder="Report Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded shadow-sm focus:ring focus:ring-blue-300"
          rows={5}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {message && (
          <p className="mt-2 text-sm text-green-600 font-medium">{message}</p>
        )}
      </form>
    </Modal>
  );
}
