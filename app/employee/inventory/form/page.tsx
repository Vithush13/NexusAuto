"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal/modal";

interface InventoryItem {
  _id: string;
  item: string;
  quantity: string;
}

interface Task {
  _id: string;
  title: string;
  vehicle: string;
  employee: string; 
  description?: string;
}

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter(); // ✅ Added router

  // Fetch inventory and task data
  useEffect(() => {
    fetch("http://localhost:5000/api/inventory")
      .then((res) => res.json())
      .then((data: InventoryItem[]) => setInventory(data))
      .catch((err) => console.error("Error fetching inventory:", err));

    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data: Task[]) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // Handle item selection toggle
  const toggleSelection = (id: string) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      if (id in updated) delete updated[id];
      else updated[id] = 1;
      return updated;
    });
  };

  // Handle quantity input
  const handleQuantityChange = (id: string, qty: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: qty,
    }));
  };

  // Submit form
  const handleSubmit = async () => {
    if (!selectedTask || Object.keys(selectedItems).length === 0) {
      alert("Please select a task and at least one inventory item.");
      return;
    }
     const taskDetails = tasks.find((t) => `${t.title} - ${t.vehicle}` === selectedTask);
  const employee = taskDetails?.employee || "Unknown Employee";
    const usedInventory = Object.entries(selectedItems).map(([id, quantityUsed]) => ({
      inventoryId: id,
      quantityUsed,
    }));

    const submission = {
      employee,
       taskName: `${taskDetails?.title || ""} - ${taskDetails?.vehicle || ""}`,
      usedInventory,
    };

    try {
      const res = await fetch("http://localhost:5000/api/inventoryUsage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      const data = await res.json();
      if (res.ok) {
        alert(" Task submitted successfully!");
        setSelectedTask("");
        setSelectedItems({});
        setIsModalOpen(false);
        router.push("/employee/inventory"); //  Redirect after submit
      } else {
        alert(` Error: ${data.message}`);
      }
    } catch (err) {
      console.error("Error submitting task:", err);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
       onClose={() => {
        setIsModalOpen(false);
        router.push("/employee/inventory");
      }}
      title="Task & Inventory Submission"
    >
      <div className="p-4">
        {/* Task Dropdown */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Select a Task:
          </label>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="">-- Choose a task --</option>
            {tasks.map((task) => (
              <option key={task._id} value={`${task.title} - ${task.vehicle}`}>
                {task.title} - {task.vehicle}
              </option>
            ))}
          </select>
        </div>

        {/* Inventory List */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-3">
            Select Inventory Items Used:
          </label>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {inventory.map((item) => (
              <label
                key={item._id}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-sm transition"
              >
                <div>
                  <span className="font-medium text-gray-800">{item.item}</span>
                  <span className="text-gray-500 ml-2 text-sm">
                    ({item.quantity} available)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item._id in selectedItems}
                    onChange={() => toggleSelection(item._id)}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                  {item._id in selectedItems && (
                    <input
                      type="number"
                      min="1"
                      value={selectedItems[item._id]}
                      onChange={(e) =>
                        handleQuantityChange(item._id, Number(e.target.value))
                      }
                      className="w-20 border rounded-lg p-1 text-center text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
          >
            Submit Task
          </button>
        </div>
      </div>
    </Modal>
  );
}
