"use client";

import { useRouter } from "next/navigation";
import { EmployeeOnly } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/store/authStore";
import { useEffect, useState } from "react";
import Inventory from "./inventory/page";
/**
 * Employee Dashboard component
 *
 * Features:
 * - Employee-specific content
 * - Access for both employees and admins
 * - Role-based welcome message
 */

interface Task {
  _id: string;
  title: string;
  vehicle: string;
  employee: string;
  status: string;
  updatedAt: string;
  createdAt: string;
}
export default function EmployeeDashboard() {
  return (
     <EmployeeOnly>
      <EmployeeDashboardContent />
    </EmployeeOnly>
    
  );
}

function EmployeeDashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
    const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
  });
   useEffect(() => {
  const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tasks/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user?.firstName}! Here&apos;s your employee workspace.
        </p>
      </div>

      {/* Dashboard Cards */}
     <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
  {/* Total Tasks */}
  <div className="overflow-hidden rounded-lg bg-white shadow">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="truncate text-sm font-medium text-gray-500">
              Tasks Assigned
            </dt>
            <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>

  {/* Completed Tasks */}
  <div className="overflow-hidden rounded-lg bg-white shadow">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="truncate text-sm font-medium text-gray-500">
              Tasks Completed
            </dt>
            <dd className="text-lg font-medium text-gray-900">
              {stats.completed}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>

  {/* Pending Tasks */}
  <div className="overflow-hidden rounded-lg bg-white shadow">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="truncate text-sm font-medium text-gray-500">
              Pending Tasks
            </dt>
            <dd className="text-lg font-medium text-gray-900">
              {stats.pending}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>

  {/* In Progress Tasks */}
  <div className="overflow-hidden rounded-lg bg-white shadow">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3v18h18M9 9h6v6H9z"
              />
            </svg>
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="truncate text-sm font-medium text-gray-500">
              In Progress Tasks
            </dt>
            <dd className="text-lg font-medium text-gray-900">
              {stats.inProgress}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg bg-white shadow">
          <h2 className="text-xl font-semibold text-gray-900">
            <RecentActivity/>
          </h2>
       
        
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button onClick={() => router.push("/employee/task")} className="rounded-lg border border-gray-200 bg-white p-4 shadow transition-colors hover:bg-gray-50  cursor-pointer">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">View Tasks</p>
            </div>
          </button>

          <button onClick={() => router.push("/employee/reports")} className="rounded-lg border border-gray-200 bg-white p-4 shadow transition-colors hover:bg-gray-50  cursor-pointer">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">New Report</p>
            </div>
          </button>

          <button  onClick={() => router.push("/employee/inventory")} className="rounded-lg border border-gray-200 bg-white p-4 shadow transition-colors hover:bg-gray-50  cursor-pointer">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a4 4 0 118 0v4m-8 0h8a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Inventory</p>
            </div>
          </button>
          
          <button onClick={() => router.push("/employee/team")} className="rounded-lg border border-gray-200 bg-white p-4 shadow transition-colors hover:bg-gray-50  cursor-pointer">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <svg
                  className="h-6 w-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Team</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function RecentActivity() {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchRecentTasks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tasks/recent");
        const data = await res.json();
        setRecentTasks(data);
      } catch (error) {
        console.error("Error fetching recent tasks:", error);
      }
    };
    fetchRecentTasks();
  }, []);

  // ⏱ Utility function to format "time ago"
  const timeAgo = (dateString: string) => {
    const now = new Date();
    const updated = new Date(dateString);
    const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    const hours = Math.floor(diffMinutes / 60);
    if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  // Choose icon and color based on task status
  const getIcon = (status: string) => {
    if (status === "Completed")
      return { color: "bg-green-100", icon: "M5 13l4 4L19 7", stroke: "text-green-600" };
    if (status === "In Progress")
      return { color: "bg-yellow-100", icon: "M12 9v2m0 4h.01m-6.938 4h13.856", stroke: "text-yellow-600" };
   return { color: "bg-blue-100", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6", stroke: "text-blue-600" };
  };
  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
      </div>

      <div className="px-6 py-4">
        {recentTasks.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity found.</p>
        ) : (
          <div className="space-y-4">
            {recentTasks.map((task) => {
              const { color, icon, stroke } = getIcon(task.status);
              return (
                <div key={task._id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${color}`}>
                      <svg
                        className={`h-4 w-4 ${stroke}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                      </svg>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900">
                      {task.status === "Completed" && "Completed task:"}
                      {task.status === "In Progress" && "In progress task:"}
                      {task.status === "Pending" && "New task assigned:"}{" "}
                      <span className="font-medium">
                        {task.title} - {task.vehicle}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">{timeAgo(task.updatedAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
