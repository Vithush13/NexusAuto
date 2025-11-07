"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Task {
  _id: string;
  title: string;
  vehicle: string;
  employee: string;
  status: string;
  timeLogged: number;
  displayTime?: string;
}

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  // Sort: Pending → In Progress → Completed
  const sortTasks = (data: Task[]) => {
    const statusOrder: Record<string, number> = {
      Pending: 1,
      "In Progress": 2,
      Completed: 3,
    };
    return data.sort(
      (a, b) => (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4)
    );
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(sortTasks(data)))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // 🔹 Log time → Just redirect (no status change)
  const handleLogTime = (task: Task) => {
    router.push(`/employee/task/${task._id}`);
  };

  // 🔹 Navigate if already started
  const goToTask = (task: Task) => {
    router.push(`/employee/task/${task._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">My Tasks</h1>
       <button
        onClick={() => router.push("/employee")}
        className="mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded cursor-pointer text-white "
      >
        ← Back
      </button>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-4 bg-white rounded-xl shadow transition hover:shadow-md"
          >
            <p className="font-semibold">{task.title}</p>
            <p>Vehicle: {task.vehicle}</p>
            <p>Status: {task.status}</p>
            <p>
              Time Logged:{" "}
              {task.displayTime
                ? task.displayTime
                : task.status === "In Progress"
                ? "Task in progress..."
                : "Not started yet"}
            </p>

            <div className="mt-3">
              {task.status === "Pending" ? (
                <button
                  onClick={() => handleLogTime(task)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Log Time
                </button>
              ) : (
                <button
                  onClick={() => goToTask(task)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Go to Task
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
