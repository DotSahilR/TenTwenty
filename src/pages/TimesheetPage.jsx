import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { timesheetApi } from "../services/timesheetApi";
import Navbar from "../components/Navbar";

const TimesheetPage = () => {
  const { week } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timesheet, setTimesheet] = useState(null);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalHours, setTotalHours] = useState(0);

  const generateWeekDays = (weekNumber) => {
    const baseDate = new Date(2024, 0, 1);
    const startDate = new Date(
      baseDate.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000
    );

    const days = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dayName = date
        .toLocaleDateString("en-US", { weekday: "short" })
        .toLowerCase();
      const dayNumber = date.getDate();
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      days.push({
        key: `${dayName}-${dayNumber}`,
        display: `${
          dayName.charAt(0).toUpperCase() + dayName.slice(1)
        }, ${monthName} ${dayNumber}`,
        fullDate: date.toISOString().split("T")[0],
      });
    }
    return days;
  };

  const weekDays = generateWeekDays(parseInt(week));

  useEffect(() => {
    fetchTimesheetData();
  }, [week]);

  useEffect(() => {
    const total = Object.values(tasks)
      .flat()
      .reduce((sum, task) => sum + (parseFloat(task.hours) || 0), 0);
    setTotalHours(total);
  }, [tasks]);

  const fetchTimesheetData = async () => {
    try {
      const response = await timesheetApi.getTimesheet(week);
      if (response.success) {
        setTimesheet(response.timesheet);
        setTasks(response.tasks);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch timesheet data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTasks = async () => {
    try {
      const response = await timesheetApi.saveTasks(week, tasks);
      if (response.success) {
        toast({
          title: "Success",
          description: "Timesheet saved successfully",
        });
        fetchTimesheetData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save timesheet",
        variant: "destructive",
      });
    }
  };

  const addTask = (dayKey) => {
    const day = weekDays.find((d) => d.key === dayKey);
    const newTask = {
      id: Date.now() + Math.random(),
      description: "",
      hours: "",
      date: day.fullDate,
      isEditing: true,
    };

    setTasks((prev) => ({
      ...prev,
      [dayKey]: [...(prev[dayKey] || []), newTask],
    }));
  };

  const updateTask = (dayKey, taskId, field, value) => {
    setTasks((prev) => ({
      ...prev,
      [dayKey]: prev[dayKey].map((task) =>
        task.id === taskId ? { ...task, [field]: value } : task
      ),
    }));
  };

  const deleteTask = (dayKey, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [dayKey]: prev[dayKey].filter((task) => task.id !== taskId),
    }));

    toast({
      title: "Success",
      description: "Task deleted successfully",
    });
  };

  const toggleEdit = (dayKey, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [dayKey]: prev[dayKey].map((task) =>
        task.id === taskId ? { ...task, isEditing: !task.isEditing } : task
      ),
    }));
  };

  const saveTask = (dayKey, taskId) => {
    const task = tasks[dayKey]?.find((t) => t.id === taskId);
    if (!task?.description || !task?.hours) {
      toast({
        title: "Error",
        description: "Please fill in task description and hours",
        variant: "destructive",
      });
      return;
    }

    setTasks((prev) => ({
      ...prev,
      [dayKey]: prev[dayKey].map((task) =>
        task.id === taskId ? { ...task, isEditing: false } : task
      ),
    }));

    toast({
      title: "Success",
      description: "Task saved successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-8 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8 p-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Week {week} Timesheet</h1>
              <p className="text-sm text-muted-foreground">{timesheet?.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={saveTasks}
              className="bg-primary hover:bg-primary/90"
            >
              Save Timesheet
            </Button>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {Math.round((totalHours / 40) * 100)}%
              </p>
              <p className="text-lg font-semibold">{totalHours}/40 hrs</p>
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalHours / 40) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-4">
          {weekDays.map((day) => (
            <div key={day.key} className="space-y-3">
              <h3 className="font-semibold text-lg">{day.display}</h3>

              <div className="space-y-2 mb-4">
                {(tasks[day.key] || []).map((task) => (
                  <div
                    key={task.id}
                    className="bg-white border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex-1 flex items-center gap-4">
                      {task.isEditing ? (
                        <input
                          type="text"
                          value={task.description}
                          onChange={(e) =>
                            updateTask(
                              day.key,
                              task.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Task description"
                          className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="flex-1">{task.description}</span>
                      )}

                      <div className="flex items-center gap-2">
                        {task.isEditing ? (
                          <input
                            type="number"
                            value={task.hours}
                            onChange={(e) =>
                              updateTask(
                                day.key,
                                task.id,
                                "hours",
                                e.target.value
                              )
                            }
                            placeholder="Hours"
                            className="w-16 px-2 py-1 border rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {task.hours} hrs
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {task.isEditing ? (
                        <Button
                          size="sm"
                          onClick={() => saveTask(day.key, task.id)}
                          className="h-8 px-3"
                        >
                          Save
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEdit(day.key, task.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(day.key, task.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  onClick={() => addTask(day.key)}
                  className="w-full border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50 py-6"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add new task
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TimesheetPage;
