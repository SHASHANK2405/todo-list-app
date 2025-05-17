"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  tags: string[];
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState({
    title: "",
    priority: "Low" as Task["priority"],
    tags: "",
  });
  const [filter, setFilter] = useState({
    priority: "",
    tag: "",
  });

  const baseURL = "http://localhost:8000/tasks";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get<Task[]>(baseURL);
    setTasks(res.data);
  };

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    await axios.post(baseURL, {
      title: form.title,
      priority: form.priority,
      tags: form.tags.split(",").map((t) => t.trim()),
    });
    setForm({ title: "", priority: "Low", tags: "" });
    fetchTasks();
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`${baseURL}/${id}`);
    fetchTasks();
  };

  const handleToggle = async (id: number, completed: boolean) => {
    await axios.patch(`${baseURL}/${id}`, { completed: !completed });
    fetchTasks();
  };

  const getColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-yellow-500";
      case "Low":
        return "text-green-500";
      default:
        return "";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchPriority = filter.priority
      ? task.priority === filter.priority
      : true;
    const matchTag = filter.tag ? task.tags.includes(filter.tag) : true;
    return matchPriority && matchTag;
  });

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        To-Do List with Priority & Tags
      </h1>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Task title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <select
          className="border p-2 bg-white text-black font-normal rounded outline-none focus:ring-2 focus:ring-blue-400"
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value as Task["priority"] })
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <input
          className="border p-2 flex-1"
          placeholder="Tags (comma-separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <select
          className="border p-2"
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
        >
          <option value="">All Priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input
          className="border p-2"
          placeholder="Filter by tag"
          value={filter.tag}
          onChange={(e) => setFilter({ ...filter, tag: e.target.value })}
        />
      </div>

      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between border p-3 rounded mb-2 bg-white shadow-sm"
        >
          <div className="flex-1">
            <p
              className={`font-semibold ${getColor(task.priority)} ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.title}
            </p>
            <p className="text-sm text-gray-500">
              Priority: {task.priority} | Tags: {task.tags.join(", ")}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="text-blue-500"
              onClick={() => handleToggle(task.id, task.completed)}
            >
              {task.completed ? "Undo" : "Done"}
            </button>
            <button
              className="text-red-500"
              onClick={() => handleDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
