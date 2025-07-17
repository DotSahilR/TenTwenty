import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { timesheetApi } from "../services/timesheetApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TimesheetTable = () => {
  const [timesheets, setTimesheets] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const [loading, setLoading] = useState(false);

  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const response = await timesheetApi.getTimesheets();
      if (response.success) {
        setTimesheets(response.timesheets);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch timesheets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToTimesheet = (timesheet) => {
    navigate(`/timesheet/${timesheet.week}`);
  };

  const createNewWeek = async () => {
    const nextWeek = Math.max(...timesheets.map((t) => t.week)) + 1;

    let response;
    try {
      response = await timesheetApi.createTimesheet(nextWeek);
      if (!response.success) throw new Error("Creation failed");
    } catch (error) {
      return toast({
        title: "Error",
        description: "Failed to create new timesheet",
        variant: "destructive",
      });
    }

    toast({
      title: "Success",
      description: `Week ${nextWeek} timesheet created successfully`,
    });

    try {
      await fetchTimesheets();
      navigate(`/timesheet/${nextWeek}`);
    } catch (error) {
      console.error(
        "Warning: Created week, but post-create steps failed",
        error
      );
      toast({
        title: "Warning",
        description: "Week created, but reload or navigation failed.",
        variant: "default",
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        label: "COMPLETED",
        className:
          "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
      },
      incomplete: {
        label: "INCOMPLETE",
        className:
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
      },
      missing: {
        label: "MISSING",
        className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
      },
    };

    const config = statusConfig[status] || statusConfig.missing;

    return (
      <Badge className={`${config.className} font-medium border`}>
        {config.label}
      </Badge>
    );
  };

  const getActionButton = (timesheet) => {
    switch (timesheet.status) {
      case "completed":
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium"
            onClick={() => navigateToTimesheet(timesheet)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        );
      case "incomplete":
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium"
            onClick={() => navigateToTimesheet(timesheet)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Update
          </Button>
        );
      case "missing":
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium"
            onClick={() => navigateToTimesheet(timesheet)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Create
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div></div>
      </div>

      <div className="container px-8 mx-auto max-w-7xl mt-4">
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden p-6">
          <div className="px-6 py-4 border-b bg-muted/30">
            <h2 className="text-xl font-bold p-4">Your Timesheets</h2>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-2 text-center">
                <TableHead className="font-bold text-sm text-foreground py-4 text-center">
                  WEEK #
                </TableHead>
                <TableHead className="font-bold text-sm text-foreground py-4 text-center">
                  DATE RANGE
                </TableHead>
                <TableHead className="font-bold text-sm text-foreground py-4 text-center">
                  STATUS
                </TableHead>
                <TableHead className="font-bold text-sm text-foreground py-4 text-center">
                  HOURS
                </TableHead>
                <TableHead className="font-bold text-sm text-foreground py-4 text-center">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {timesheets.map((timesheet) => (
                <TableRow
                  key={timesheet.id}
                  className="hover:bg-muted/50 transition-colors border-b text-center"
                >
                  <TableCell className="text-lg py-4">
                    {timesheet.week}
                  </TableCell>
                  <TableCell className="py-6">
                    <div>
                      <p className="font-medium">{timesheet.date}</p>
                      <p className="text-sm text-muted-foreground">Mon - Fri</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    {getStatusBadge(timesheet.status)}
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex justify-center items-center gap-2">
                      <span className="font-semibold">
                        {timesheet.hoursLogged}h
                      </span>
                      <span className="text-muted-foreground">/ 40h</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    {getActionButton(timesheet)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="container px-8 mx-auto max-w-7xl mt-4">
        <div className="flex justify-end w-48">
          <Button
            variant="danger"
            size="lg"
            className="w-full shadow-lg"
            onClick={createNewWeek}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Week
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimesheetTable;
