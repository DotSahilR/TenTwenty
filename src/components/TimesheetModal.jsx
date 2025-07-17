import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X, Plus, Trash2, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { timesheetApi } from "@/services/timesheetApi";

const TimesheetModal = ({ isOpen, onClose, timesheet, mode }) => {
  const [tasks, setTasks] = useState([]);
  const [editMode, setEditMode] = useState(
    mode === "edit" || mode === "create"
  );
  const { toast } = useToast();

  useEffect(() => {
    const loadTasks = async () => {
      if (!timesheet) return;

      try {
        const response = await timesheetApi.getTimesheet(timesheet.week);
        const flatTasks = Object.values(response.tasks || {})
          .flat()
          .map((task) => ({
            id: task.id,
            description: task.description,
            hours: task.hours,
            date: task.date,
          }));

        setTasks(
          mode === "create"
            ? [{ id: Date.now(), description: "", hours: "", date: "" }]
            : flatTasks
        );
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    };

    loadTasks();
  }, [timesheet, mode]);

  const addTask = () => {
    setTasks([
      ...tasks,
      { id: Date.now(), description: "", hours: "", date: "" },
    ]);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (id, field, value) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, [field]: value } : task))
    );
  };

  const groupTasksByDate = (taskArray) => {
    return taskArray.reduce((acc, task) => {
      const dayKey = `day-${new Date(task.date).getDate()}`;
      if (!acc[dayKey]) acc[dayKey] = [];
      acc[dayKey].push(task);
      return acc;
    }, {});
  };

  const saveTimesheet = async () => {
    if (!timesheet) return;

    const grouped = groupTasksByDate(tasks);

    try {
      await timesheetApi.saveTasks(timesheet.week, grouped);
      toast({
        title: "Success",
        description: `Timesheet ${
          mode === "create" ? "created" : "updated"
        } successfully`,
      });
      onClose();
    } catch (error) {
      console.error("Error saving timesheet:", error);
      toast({
        title: "Error",
        description: "Failed to save tasks",
        variant: "destructive",
      });
    }
  };

  const totalHours = tasks.reduce(
    (sum, task) => sum + (parseFloat(task.hours) || 0),
    0
  );

  const getStatusBadge = (hours) => {
    if (hours >= 40)
      return { label: "COMPLETED", className: "bg-green-100 text-green-800" };
    if (hours > 0)
      return {
        label: "INCOMPLETE",
        className: "bg-yellow-100 text-yellow-800",
      };
    return { label: "MISSING", className: "bg-red-100 text-red-800" };
  };

  const status = getStatusBadge(totalHours);

  if (!timesheet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto px-8 py-4">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">
                {mode === "create"
                  ? "Create New Timesheet"
                  : `Week ${timesheet.week} Timesheet`}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {timesheet.date}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={status.className}>{status.label}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {totalHours}h / 40h
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Tasks</h3>
            {editMode && (
              <Button onClick={addTask} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No tasks logged for this week</p>
                {editMode && (
                  <Button onClick={addTask} variant="outline" className="mt-3">
                    <Plus className="h-4 w-4 mr-1" />
                    Add First Task
                  </Button>
                )}
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    {editMode ? (
                      <input
                        type="text"
                        value={task.description}
                        onChange={(e) =>
                          updateTask(task.id, "description", e.target.value)
                        }
                        placeholder="Task description"
                        className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="font-medium">{task.description}</p>
                    )}
                  </div>
                  <div className="w-20">
                    {editMode ? (
                      <input
                        type="number"
                        value={task.hours}
                        onChange={(e) =>
                          updateTask(task.id, "hours", e.target.value)
                        }
                        placeholder="Hours"
                        className="w-full px-2 py-1 border rounded text-center focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <Badge variant="secondary">{task.hours}h</Badge>
                    )}
                  </div>
                  <div className="w-32">
                    {editMode ? (
                      <input
                        type="date"
                        value={task.date}
                        onChange={(e) =>
                          updateTask(task.id, "date", e.target.value)
                        }
                        className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {task.date}
                      </p>
                    )}
                  </div>
                  {editMode && (
                    <Button
                      onClick={() => removeTask(task.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total Hours:</span>
            <span className="font-semibold">{totalHours}h</span>
          </div>
          <div className="flex gap-2">
            {mode === "view" && !editMode && (
              <Button onClick={() => setEditMode(true)} variant="outline">
                Edit Timesheet
              </Button>
            )}
            {editMode && (
              <>
                <Button
                  onClick={() => {
                    if (mode === "view") {
                      setEditMode(false);
                    } else {
                      onClose();
                    }
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={saveTimesheet}>
                  {mode === "create" ? "Create" : "Save Changes"}
                </Button>
              </>
            )}
            {mode === "view" && !editMode && (
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimesheetModal;
