"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/modal/modal"; // adjust path if needed

interface Task {
  _id: string;
  title: string;
  vehicle: string;
  employee: string;
  status: string;
  timeLogged: number;
  startTime?: string;
  endTime?: string;
  displayTime?: string;
}

export default function TaskDetail() {
  const params = useParams();
  const taskId = params.id as string;
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/tasks/${taskId}`)
      .then((res) => res.json())
      .then((data) => setTask(data))
      .catch((err) => console.error(err));
  }, [taskId]);

  const updateStatus = async (newStatus: string) => {
    if (!task) return;
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTask(updatedTask);
      }
    } catch (err) {
      console.error("Error updating task:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!task) return <p>Loading...</p>;

  return (
    <Modal
      isOpen={openModal}
      onClose={() => {
        setOpenModal(false);
        router.push("/employee/task");
      }}
      title={task.title}
    >
      <div>
        <p>Vehicle: {task.vehicle}</p>
        <p>Employee: {task.employee}</p>
        <p>
          Time Logged:{" "}
          {task.displayTime
            ? task.displayTime
            : task.status === "In Progress"
            ? "Task in progress..."
            : "Not started yet"}
        </p>
        <p>
          Status: <b>{task.status}</b>
        </p>
        <p>
          Start Time:{" "}
          {task.startTime ? new Date(task.startTime).toLocaleString() : "-"}
        </p>
        <p>
          End Time: {task.endTime ? new Date(task.endTime).toLocaleString() : "-"}
        </p>

        <div className="mt-4 space-x-2">
          <button
            onClick={() => updateStatus("In Progress")}
            disabled={task.status !== "Pending" || loading}
            className={`px-4 py-2 rounded text-white ${
              task.status === "Pending"
                ? "bg-yellow-400 hover:bg-yellow-500 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Start Task
          </button>

          <button
            onClick={() => updateStatus("Completed")}
            disabled={task.status !== "In Progress" || loading}
            className={`px-4 py-2 rounded text-white ${
              task.status === "In Progress"
                ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Complete Task
          </button>
        </div>
      </div>
    </Modal>
  );
}
