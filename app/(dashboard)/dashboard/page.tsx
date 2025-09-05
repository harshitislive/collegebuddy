"use client"

import { useState } from "react"
import { Flame } from "lucide-react"
import { Button } from "@/components/ui/button"

// Dummy event posters (replace with real images later)
const events = [
  { id: 1, img: "/events/event1.webp" },
  { id: 2, img: "/events/event1.webp" },
  { id: 3, img: "/events/event1.webp" },
]

export default function DashboardPage() {
  const [name] = useState("Buddy") // default name
  const [currentEvent, setCurrentEvent] = useState(0)
  const [tasks, setTasks] = useState<string[]>([])
  const [newTask, setNewTask] = useState("")

  // Carousel controls
  const nextEvent = () => setCurrentEvent((prev) => (prev + 1) % events.length)
  const prevEvent = () => setCurrentEvent((prev) => (prev - 1 + events.length) % events.length)

  // Task controls
  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, newTask])
      setNewTask("")
    }
  }
  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome {name} 👋</h1>
        <div className="flex items-center gap-2 text-orange-500">
          <Flame size={24} />
          <span className="font-semibold">5-day Streak</span>
        </div>
      </div>

      {/* Event Updates Carousel */}
      <div className="relative w-full max-w-2xl mx-auto">
        <img
          src={events[currentEvent].img}
          alt="Event poster"
          className="rounded-xl shadow-md w-full"
        />
        <div className="absolute inset-0 flex justify-between items-center px-4">
          <Button variant="secondary" onClick={prevEvent}>◀</Button>
          <Button variant="secondary" onClick={nextEvent}>▶</Button>
        </div>
      </div>

      {/* To-Do Tasks */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📝 To-Do Tasks</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-2"
          />
          <Button onClick={addTask}>Add</Button>
        </div>
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-white shadow px-4 py-2 rounded-lg"
            >
              <span>{task}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeTask(index)}
              >
                Remove
              </Button>
            </li>
          ))}
          {tasks.length === 0 && (
            <p className="text-gray-500">No tasks yet. Add one above 👆</p>
          )}
        </ul>
      </div>
    </div>
  )
}
