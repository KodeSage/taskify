"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { useState } from "react"
import { useFireproof } from "use-fireproof"
import confetti from "canvas-confetti"
import {
  Calendar,
  Clock,
  Edit,
  FileDown,
  Filter,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowDownAZ,
  Database,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Task {
  title: string
  description: string
  dueDate: string
  dueTime: string
  priority: "high" | "medium" | "low"
  completed: boolean
  createdAt: number
  updatedAt: number
}

function App() {
  // Initialize Fireproof
  const { useDocument, database, useLiveQuery } = useFireproof("task-manager")
  const result = useLiveQuery("updatedAt", { descending: true })
  const todos = result.docs as (Task & { _id: string })[]

  const [sortOrder, setSortOrder] = useState("priority")
  const [activeTab, setActiveTab] = useState("all")
  const {
    doc: todo,
    merge: mergeTask,
    save: saveTask,
    reset: resetTask,
  } = useDocument<Task>(() => ({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    dueTime: "12:00",
    priority: "medium",
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }))

  const handleSortChange = (value: string) => {
    setSortOrder(value)
  }

  const sortedTodos = [...todos].sort((a, b) => {
    if (sortOrder === "priority" || sortOrder === "high" || sortOrder === "medium" || sortOrder === "low") {
      const priorityOrder = { high: 1, medium: 2, low: 3 }
      if (sortOrder === "priority") {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return priorityOrder[sortOrder as keyof typeof priorityOrder] - priorityOrder[a.priority]
    }
    return a.dueDate.localeCompare(b.dueDate)
  })

  const filteredTodos = sortedTodos.filter((task) => {
    if (activeTab === "all") return true
    if (activeTab === "completed") return task.completed
    if (activeTab === "active") return !task.completed
    return true
  })

  const handleEditTask = (task: Task & { _id: string }) => {
    mergeTask(task) // Populate the form with the task to edit
  }

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the edit function
    await database.del(taskId)
  }

  const handleToggleComplete = async (task: Task & { _id: string }, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the edit function
    await database.put({
      ...task,
      completed: !task.completed,
      updatedAt: Date.now(),
    })

    if (!task.completed) {
      // Only trigger confetti when marking as complete
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Only trigger confetti when creating a new task (not editing)
    if (!todo._id) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

  await saveTask({
    ...todo,
    updatedAt: Date.now(), // Update the timestamp
  });
    resetTask()
  }

  const handleExportTasks = () => {
    const dataStr = JSON.stringify(todos, null, 2) // Convert tasks to JSON
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "tasks.json" // Name of the downloaded file
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "low":
        return <AlertCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-lg mr-3">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Taskify
              </h1>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-gray-600 dark:hover:border-gray-500"
                    onClick={handleExportTasks}
                  >
                    <FileDown className="h-4 w-4" />
                    <span className="hidden sm:inline">Export Tasks</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export tasks as JSON</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Instructions Card */}
        <Card className="mb-8 border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-purple-700 dark:text-purple-400">Welcome to Taskify</CardTitle>
            <CardDescription>Your personal task management system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-purple-50 dark:bg-gray-700/50">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                  <Plus className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-purple-700 dark:text-purple-400">Create Tasks</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Add tasks with details, due dates, and priority levels
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg bg-purple-50 dark:bg-gray-700/50">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                  <Filter className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-purple-700 dark:text-purple-400">Filter & Sort</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Organize tasks by priority, completion status, and due date
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg bg-purple-50 dark:bg-gray-700/50">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                  <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-purple-700 dark:text-purple-400">Persistent Storage</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    All data persists in browser using Fireproof - no backend needed!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Task Form */}
          <div className="lg:col-span-5">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  {todo._id ? (
                    <>
                      <Edit className="h-5 w-5" />
                      Edit Task
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      New Task
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {todo._id ? "Update the task details below" : "Fill in the details to create a new task"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={todo.title as string}
                      onChange={(e) => mergeTask({ title: e.target.value })}
                      placeholder="Enter task title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={todo.description as string}
                      onChange={(e) => mergeTask({ description: e.target.value })}
                      placeholder="Enter task description"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dueDate" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        Due Date
                      </Label>
                      <Input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={todo.dueDate as string}
                        onChange={(e) => mergeTask({ dueDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueTime" className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        Due Time
                      </Label>
                      <Input
                        type="time"
                        id="dueTime"
                        name="dueTime"
                        value={todo.dueTime as string}
                        onChange={(e) => mergeTask({ dueTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-gray-500" />
                      Priority
                    </Label>
                    <Select
                      value={todo.priority as string}
                      onValueChange={(value) => mergeTask({ priority: value as "high" | "medium" | "low" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high" className="text-red-600">
                          High Priority
                        </SelectItem>
                        <SelectItem value="medium" className="text-yellow-600">
                          Medium Priority
                        </SelectItem>
                        <SelectItem value="low" className="text-green-600">
                          Low Priority
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    >
                      {todo._id ? "Update Task" : "Create Task"}
                    </Button>

                    {todo._id && (
                      <Button type="button" variant="outline" className="w-full mt-2" onClick={() => resetTask()}>
                        Cancel Editing
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Task List */}
          <div className="lg:col-span-7">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-purple-700 dark:text-purple-400">Your Tasks</CardTitle>
                  <div className="flex items-center gap-2">
                    <ArrowDownAZ className="h-4 w-4 text-gray-500" />
                    <Select value={sortOrder} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="priority">Sort by Priority</SelectItem>
                        <SelectItem value="dueDate">Sort by Due Date</SelectItem>
                        <SelectItem value="high">High Priority Only</SelectItem>
                        <SelectItem value="medium">Medium Priority Only</SelectItem>
                        <SelectItem value="low">Low Priority Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <CardDescription>
                  {filteredTodos.length} {filteredTodos.length === 1 ? "task" : "tasks"}{" "}
                  {activeTab !== "all" ? `(${activeTab})` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="all">All Tasks</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  <TabsContent value={activeTab} className="mt-0">
                    <ScrollArea className="h-[500px] pr-4">
                      {filteredTodos.length > 0 ? (
                        <div className="space-y-3">
                          {filteredTodos.map((task) => (
                            <div
                              key={task._id}
                              onClick={() => handleEditTask(task)}
                              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                                task.completed
                                  ? "bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700"
                                  : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <div onClick={(e) => handleToggleComplete(task, e)} className="mt-1 cursor-pointer">
                                    {task.completed ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <XCircle className="h-5 w-5 text-gray-300 hover:text-gray-400" />
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                                      {task.title}
                                    </h3>
                                    {task.description && (
                                      <p
                                        className={`text-sm ${task.completed ? "text-gray-400" : "text-gray-600 dark:text-gray-300"}`}
                                      >
                                        {task.description}
                                      </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                                        <span className="flex items-center gap-1">
                                          {getPriorityIcon(task.priority)}
                                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                        </span>
                                      </Badge>

                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                                      >
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(task.dueDate).toLocaleDateString()}
                                      </Badge>

                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                                      >
                                        <Clock className="h-3 w-3 mr-1" />
                                        {new Date(`1970-01-01T${task.dueTime}:00`).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: true,
                                        })}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {task.completed && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => handleDeleteTask(task._id, e)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                )}
                              </div>

                              <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
                                <p>Updated: {new Date(task.updatedAt).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <CheckCircle2 className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No tasks found</h3>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {activeTab === "all"
                              ? "You haven't created any tasks yet"
                              : activeTab === "active"
                                ? "You don't have any active tasks"
                                : "You don't have any completed tasks"}
                          </p>
                          {activeTab !== "all" && (
                            <Button variant="link" onClick={() => setActiveTab("all")} className="mt-2">
                              View all tasks
                            </Button>
                          )}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

